import com.sun.source.tree.AnnotationTree;
import com.sun.source.tree.ClassTree;
import com.sun.source.tree.CompilationUnitTree;
import com.sun.source.tree.MethodTree;
import com.sun.source.tree.ImportTree;
import com.sun.source.tree.Tree;
import com.sun.source.tree.VariableTree;
import com.sun.source.util.DocTrees;
import com.sun.source.util.JavacTask;
import com.sun.source.util.TreePath;
import com.sun.source.util.TreePathScanner;
import com.sun.source.doctree.DocCommentTree;
import com.sun.source.doctree.DocTree;
import com.sun.source.doctree.UnknownBlockTagTree;
import javax.tools.Diagnostic;
import javax.tools.DiagnosticCollector;
import javax.tools.JavaFileObject;
import javax.tools.StandardJavaFileManager;
import javax.tools.ToolProvider;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Deque;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Locale;
import java.util.stream.Collectors;

public final class SourceAnnotationIndex {
  private static String encode(String value) {
    return Base64.getEncoder().encodeToString(value.getBytes(StandardCharsets.UTF_8));
  }

  private static boolean hasAnnotation(List<? extends AnnotationTree> annotations, String name) {
    for (AnnotationTree annotation : annotations) {
      String type = annotation.getAnnotationType().toString();
      int dot = type.lastIndexOf('.');
      if (type.substring(dot + 1).equals(name)) return true;
    }
    return false;
  }

  private static boolean hasDeprecatedDoc(DocTrees docs, TreePath path) {
    DocCommentTree comment = docs.getDocCommentTree(path);
    if (comment == null) return false;
    for (DocTree tag : comment.getBlockTags()) {
      if (tag.getKind().name().equals("DEPRECATED")) return true;
      if (tag instanceof UnknownBlockTagTree && ((UnknownBlockTagTree) tag).getTagName().equals("deprecated")) return true;
    }
    return false;
  }

  private static void emit(String kind, String owner, String name, String arity, String memberKind,
                           boolean restricted, boolean deprecated, boolean docDeprecated, String parameterTypes) {
    System.out.println(String.join("|", kind, encode(owner), encode(name), arity, memberKind,
      Boolean.toString(restricted), Boolean.toString(deprecated), Boolean.toString(docDeprecated),
      encode(parameterTypes)));
  }

  private static final class Indexer extends TreePathScanner<Void, Void> {
    private final String packageName;
    private final DocTrees docs;
    private final Map<String, String> imports;
    private final Set<String> wildcardImports;
    private final Set<String> sourceTopLevelTypes;
    private final Deque<String> typeNames = new ArrayDeque<>();

    Indexer(String packageName, DocTrees docs, Map<String, String> imports,
            Set<String> wildcardImports, Set<String> sourceTopLevelTypes) {
      this.packageName = packageName;
      this.docs = docs;
      this.imports = imports;
      this.wildcardImports = wildcardImports;
      this.sourceTopLevelTypes = sourceTopLevelTypes;
    }

    private String resolveParameterType(String rawType) {
      String value = rawType.replace("...", "[]").replaceAll("@[A-Za-z0-9_.$]+(?:\\([^)]*\\))?\\s*", "").trim();
      StringBuilder erased = new StringBuilder();
      int genericDepth = 0;
      for (int index = 0; index < value.length(); index++) {
        char character = value.charAt(index);
        if (character == '<') genericDepth++;
        else if (character == '>') genericDepth = Math.max(0, genericDepth - 1);
        else if (genericDepth == 0 && !Character.isWhitespace(character)) erased.append(character);
      }
      value = erased.toString().replace('

    private String currentOwner() {
      return typeNames.peekLast();
    }

    @Override
    public Void visitClass(ClassTree node, Void unused) {
      String simple = node.getSimpleName().toString();
      if (simple.isEmpty()) return null;
      String owner = typeNames.isEmpty()
        ? (packageName.isEmpty() ? simple : packageName + "." + simple)
        : typeNames.peekLast() + "$" + simple;
      emit("T", owner, simple, "-", "type",
        hasAnnotation(node.getModifiers().getAnnotations(), "RestrictTo"),
        hasAnnotation(node.getModifiers().getAnnotations(), "Deprecated"),
        hasDeprecatedDoc(docs, getCurrentPath()), "");
      typeNames.addLast(owner);
      try { return super.visitClass(node, unused); }
      finally { typeNames.removeLast(); }
    }

    @Override
    public Void visitMethod(MethodTree node, Void unused) {
      String owner = currentOwner();
      if (owner != null) {
        String name = node.getReturnType() == null ? "<init>" : node.getName().toString();
        String parameterTypes = node.getParameters().stream()
          .map(parameter -> resolveParameterType(parameter.getType().toString()))
          .collect(Collectors.joining(";"));
        emit("M", owner, name, Integer.toString(node.getParameters().size()), "method",
          hasAnnotation(node.getModifiers().getAnnotations(), "RestrictTo"),
          hasAnnotation(node.getModifiers().getAnnotations(), "Deprecated"),
          hasDeprecatedDoc(docs, getCurrentPath()), parameterTypes);
      }
      return super.visitMethod(node, unused);
    }

    @Override
    public Void visitVariable(VariableTree node, Void unused) {
      Tree parent = getCurrentPath().getParentPath() == null ? null : getCurrentPath().getParentPath().getLeaf();
      if (parent instanceof ClassTree) {
        String owner = currentOwner();
        if (owner != null) {
          emit("M", owner, node.getName().toString(), "0", "field",
            hasAnnotation(node.getModifiers().getAnnotations(), "RestrictTo"),
            hasAnnotation(node.getModifiers().getAnnotations(), "Deprecated"),
            hasDeprecatedDoc(docs, getCurrentPath()), "");
        }
      }
      return super.visitVariable(node, unused);
    }
  }

  public static void main(String[] args) throws Exception {
    if (args.length != 1) throw new IllegalArgumentException("Usage: SourceAnnotationIndex <source-root>");
    Path root = Path.of(args[0]);
    List<Path> paths;
    try (var stream = Files.walk(root)) {
      paths = stream.filter(path -> path.toString().endsWith(".java")).sorted().collect(Collectors.toList());
    }
    var compiler = ToolProvider.getSystemJavaCompiler();
    if (compiler == null) throw new IllegalStateException("A full JDK is required.");
    DiagnosticCollector<JavaFileObject> diagnostics = new DiagnosticCollector<>();
    try (StandardJavaFileManager manager = compiler.getStandardFileManager(diagnostics, Locale.ROOT, StandardCharsets.UTF_8)) {
      Iterable<? extends JavaFileObject> units = manager.getJavaFileObjectsFromPaths(paths);
      JavacTask task = (JavacTask) compiler.getTask(null, manager, diagnostics,
        List.of("-proc:none", "-Xlint:none"), null, units);
      Iterable<? extends CompilationUnitTree> parsed = task.parse();
      DocTrees docs = DocTrees.instance(task);
      Set<String> sourceTopLevelTypes = new HashSet<>();
      for (Path sourcePath : paths) {
        String relative = root.relativize(sourcePath).toString().replace('\\', '/');
        String simpleName = relative.substring(relative.lastIndexOf('/') + 1, relative.length() - 5);
        String packageName = relative.contains("/") ? relative.substring(0, relative.lastIndexOf('/')).replace('/', '.') : "";
        sourceTopLevelTypes.add(packageName.isEmpty() ? simpleName : packageName + "." + simpleName);
      }
      for (CompilationUnitTree unit : parsed) {
        String pkg = unit.getPackageName() == null ? "" : unit.getPackageName().toString();
        Map<String, String> imports = new HashMap<>();
        Set<String> wildcardImports = new HashSet<>();
        for (ImportTree imported : unit.getImports()) {
          if (imported.isStatic()) continue;
          String qualified = imported.getQualifiedIdentifier().toString();
          if (qualified.endsWith(".*")) wildcardImports.add(qualified.substring(0, qualified.length() - 2));
          else imports.put(qualified.substring(qualified.lastIndexOf('.') + 1), qualified);
        }
        new Indexer(pkg, docs, imports, wildcardImports, sourceTopLevelTypes).scan(unit, null);
      }
      List<Diagnostic<? extends JavaFileObject>> errors = diagnostics.getDiagnostics().stream()
        .filter(diagnostic -> diagnostic.getKind() == Diagnostic.Kind.ERROR)
        .collect(Collectors.toList());
      if (!errors.isEmpty()) {
        throw new IllegalStateException("Java source parsing reported " + errors.size() + " error(s): "
          + errors.stream().limit(3).map(diagnostic -> diagnostic.getMessage(Locale.ROOT)).collect(Collectors.joining("; ")));
      }
    }
  }
}
, '.');
      String dimensions = "";
      while (value.endsWith("[]")) {
        dimensions += "[]";
        value = value.substring(0, value.length() - 2);
      }
      if (value.isEmpty() || Set.of("boolean", "byte", "short", "int", "long", "char", "float", "double").contains(value)) {
        return value + dimensions;
      }
      String first = value.contains(".") ? value.substring(0, value.indexOf('.')) : value;
      if (imports.containsKey(first)) value = imports.get(first) + value.substring(first.length());
      else if (typeNames.peekLast() != null && typeNames.peekLast().endsWith("$" + value)) value = typeNames.peekLast();
      else if (sourceTopLevelTypes.contains(packageName + "." + first)) value = packageName + "." + value;
      else if (Set.of("String", "Object", "Boolean", "Byte", "Short", "Integer", "Long", "Float", "Double",
          "Character", "Void", "Number", "CharSequence", "Throwable", "Exception", "RuntimeException",
          "Class", "Enum", "Record", "Iterable", "Comparable", "Cloneable", "AutoCloseable").contains(value)) {
        value = "java.lang." + value;
      } else if (!value.contains(".") && wildcardImports.size() == 1) {
        value = wildcardImports.iterator().next() + "." + value;
      }
      return value + dimensions;
    }

    private String currentOwner() {
      return typeNames.peekLast();
    }

    @Override
    public Void visitClass(ClassTree node, Void unused) {
      String simple = node.getSimpleName().toString();
      if (simple.isEmpty()) return null;
      String owner = typeNames.isEmpty()
        ? (packageName.isEmpty() ? simple : packageName + "." + simple)
        : typeNames.peekLast() + "$" + simple;
      emit("T", owner, simple, "-", "type",
        hasAnnotation(node.getModifiers().getAnnotations(), "RestrictTo"),
        hasAnnotation(node.getModifiers().getAnnotations(), "Deprecated"),
        hasDeprecatedDoc(docs, getCurrentPath()), "");
      typeNames.addLast(owner);
      try { return super.visitClass(node, unused); }
      finally { typeNames.removeLast(); }
    }

    @Override
    public Void visitMethod(MethodTree node, Void unused) {
      String owner = currentOwner();
      if (owner != null) {
        String name = node.getReturnType() == null ? "<init>" : node.getName().toString();
        String parameterTypes = node.getParameters().stream()
          .map(parameter -> parameter.getType().toString())
          .collect(Collectors.joining(";"));
        emit("M", owner, name, Integer.toString(node.getParameters().size()), "method",
          hasAnnotation(node.getModifiers().getAnnotations(), "RestrictTo"),
          hasAnnotation(node.getModifiers().getAnnotations(), "Deprecated"),
          hasDeprecatedDoc(docs, getCurrentPath()), parameterTypes);
      }
      return super.visitMethod(node, unused);
    }

    @Override
    public Void visitVariable(VariableTree node, Void unused) {
      Tree parent = getCurrentPath().getParentPath() == null ? null : getCurrentPath().getParentPath().getLeaf();
      if (parent instanceof ClassTree) {
        String owner = currentOwner();
        if (owner != null) {
          emit("M", owner, node.getName().toString(), "0", "field",
            hasAnnotation(node.getModifiers().getAnnotations(), "RestrictTo"),
            hasAnnotation(node.getModifiers().getAnnotations(), "Deprecated"),
            hasDeprecatedDoc(docs, getCurrentPath()), "");
        }
      }
      return super.visitVariable(node, unused);
    }
  }

  public static void main(String[] args) throws Exception {
    if (args.length != 1) throw new IllegalArgumentException("Usage: SourceAnnotationIndex <source-root>");
    Path root = Path.of(args[0]);
    List<Path> paths;
    try (var stream = Files.walk(root)) {
      paths = stream.filter(path -> path.toString().endsWith(".java")).sorted().collect(Collectors.toList());
    }
    var compiler = ToolProvider.getSystemJavaCompiler();
    if (compiler == null) throw new IllegalStateException("A full JDK is required.");
    DiagnosticCollector<JavaFileObject> diagnostics = new DiagnosticCollector<>();
    try (StandardJavaFileManager manager = compiler.getStandardFileManager(diagnostics, Locale.ROOT, StandardCharsets.UTF_8)) {
      Iterable<? extends JavaFileObject> units = manager.getJavaFileObjectsFromPaths(paths);
      JavacTask task = (JavacTask) compiler.getTask(null, manager, diagnostics,
        List.of("-proc:none", "-Xlint:none"), null, units);
      Iterable<? extends CompilationUnitTree> parsed = task.parse();
      DocTrees docs = DocTrees.instance(task);
      for (CompilationUnitTree unit : parsed) {
        String pkg = unit.getPackageName() == null ? "" : unit.getPackageName().toString();
        new Indexer(pkg, docs).scan(unit, null);
      }
      List<Diagnostic<? extends JavaFileObject>> errors = diagnostics.getDiagnostics().stream()
        .filter(diagnostic -> diagnostic.getKind() == Diagnostic.Kind.ERROR)
        .collect(Collectors.toList());
      if (!errors.isEmpty()) {
        throw new IllegalStateException("Java source parsing reported " + errors.size() + " error(s): "
          + errors.stream().limit(3).map(diagnostic -> diagnostic.getMessage(Locale.ROOT)).collect(Collectors.joining("; ")));
      }
    }
  }
}
