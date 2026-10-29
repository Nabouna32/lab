import com.sun.source.tree.AnnotationTree;
import com.sun.source.tree.ClassTree;
import com.sun.source.tree.CompilationUnitTree;
import com.sun.source.tree.MethodTree;
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
                           boolean restricted, boolean deprecated, boolean docDeprecated) {
    System.out.println(String.join("|", kind, encode(owner), encode(name), arity, memberKind,
      Boolean.toString(restricted), Boolean.toString(deprecated), Boolean.toString(docDeprecated)));
  }

  private static final class Indexer extends TreePathScanner<Void, Void> {
    private final String packageName;
    private final DocTrees docs;
    private final Deque<String> typeNames = new ArrayDeque<>();

    Indexer(String packageName, DocTrees docs) {
      this.packageName = packageName;
      this.docs = docs;
    }

    private String currentOwner() {
      return typeNames.peekLast();
    }

    @Override
    public Void visitClass(ClassTree node, Void unused) {
      String simple = node.getSimpleName().toString();
      if (simple.isEmpty()) return super.visitClass(node, unused);
      String owner = typeNames.isEmpty()
        ? (packageName.isEmpty() ? simple : packageName + "." + simple)
        : typeNames.peekLast() + "$" + simple;
      emit("T", owner, simple, "-", "type",
        hasAnnotation(node.getModifiers().getAnnotations(), "RestrictTo"),
        hasAnnotation(node.getModifiers().getAnnotations(), "Deprecated"),
        hasDeprecatedDoc(docs, getCurrentPath()));
      typeNames.addLast(owner);
      try { return super.visitClass(node, unused); }
      finally { typeNames.removeLast(); }
    }

    @Override
    public Void visitMethod(MethodTree node, Void unused) {
      String owner = currentOwner();
      if (owner != null) {
        String name = node.getReturnType() == null ? "<init>" : node.getName().toString();
        emit("M", owner, name, Integer.toString(node.getParameters().size()), "method",
          hasAnnotation(node.getModifiers().getAnnotations(), "RestrictTo"),
          hasAnnotation(node.getModifiers().getAnnotations(), "Deprecated"),
          hasDeprecatedDoc(docs, getCurrentPath()));
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
            hasDeprecatedDoc(docs, getCurrentPath()));
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
