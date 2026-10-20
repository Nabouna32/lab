"use client";
import {useEffect,useRef,useState} from "react";
import {Button} from "@/components/ui/Button";import {ClearButton} from "@/components/ui/ClearButton";import {useLocale} from "@/lib/i18n/use-locale";import {getToolMessages} from "@/lib/i18n/tool-messages";import {AnimatedImageUnsupportedError,getCleanImageFormat,inspectImage,stripImageMetadata,type ImageMetadata} from "@/lib/image-metadata";
const MAX=25*1024*1024;
export default function ImageMetadataViewer(){
const locale=useLocale(),t=getToolMessages(locale).imageMetadata;
const[file,setFile]=useState<File|null>(null),[data,setData]=useState<ImageMetadata|null>(null),[clean,setClean]=useState<string|null>(null),[preview,setPreview]=useState<string|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState<string|null>(null);
const operationRef=useRef(0);
useEffect(()=>()=>{if(clean)URL.revokeObjectURL(clean);if(preview)URL.revokeObjectURL(preview)},[clean,preview]);
useEffect(()=>()=>{operationRef.current+=1},[]);
async function select(next:File|null){
if(!next)return;
const operation=++operationRef.current;
if(!next.type.startsWith("image/")||next.size>MAX){
setFile(null);setData(null);setClean(null);setPreview(null);setBusy(false);
setError(!next.type.startsWith("image/")?t.invalidType:t.tooLarge);return;
}
setBusy(true);setError(null);setClean(null);setData(null);
setFile(next);setPreview(URL.createObjectURL(next));
try{
const metadata=await inspectImage(next);
if(operation!==operationRef.current)return;
setData(metadata);
}catch{
if(operation!==operationRef.current)return;
setFile(null);setData(null);setPreview(null);setError(t.invalid);
}finally{if(operation===operationRef.current)setBusy(false)}
}
async function strip(){
const selected=file,operation=operationRef.current;
if(!selected)return;
setBusy(true);setError(null);
try{
const blob=await stripImageMetadata(selected);
if(operation!==operationRef.current)return;
const url=URL.createObjectURL(blob);
setClean(previous=>{if(previous)URL.revokeObjectURL(previous);return url});
}catch(cause){if(operation===operationRef.current)setError(cause instanceof AnimatedImageUnsupportedError?t.animatedUnsupported:t.invalid)}
finally{if(operation===operationRef.current)setBusy(false)}
}
function download(){if(!clean)return;const a=document.createElement("a");a.href=clean;a.download=`loculary-clean-image.${getCleanImageFormat(file?.type??"").extension}`;a.click()}
function reset(){operationRef.current+=1;setFile(null);setData(null);setClean(null);setPreview(null);setBusy(false);setError(null)}
const exif=data?Object.entries(data.exif):[];
const exifLabels:Record<string,string>={
cameraMake:t.cameraMake,cameraModel:t.cameraModel,dateTaken:t.dateTaken,dateModified:t.dateModified,
orientation:t.orientation,gps:t.gps,software:t.software,
};
return <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]"><div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.85fr)] lg:p-8"><div className="space-y-5"><label htmlFor="image-metadata-file" className="block cursor-pointer rounded-[var(--radius-md)] border-2 border-dashed border-[var(--border)] bg-[var(--background)] p-6 text-center transition hover:border-[var(--accent)] focus-within:border-[var(--accent)]"><span className="block text-sm font-semibold text-[var(--foreground)]">{t.input}</span><span className="mt-2 block text-sm text-[var(--muted)]">{t.inputHint}</span><input id="image-metadata-file" type="file" accept="image/*" className="sr-only" onChange={e=>{void select(e.target.files?.[0]??null);e.target.value=""}}/></label><p className="text-sm text-[var(--muted)]">🔒 {t.local}</p>{data&&<><div className="grid gap-3 sm:grid-cols-3">{[[t.dimensions,data.width+" × "+data.height+" px"],[t.format,data.mimeType],[t.fileSize,formatBytes(data.size)]].map(([label,value])=><div key={label} className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] p-3"><p className="text-xs text-[var(--muted)]">{label}</p><p className="mt-1 break-words font-semibold text-[var(--foreground)]">{value}</p></div>)}</div><div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] p-4"><h3 className="text-sm font-semibold text-[var(--foreground)]">{t.exif}</h3>{exif.length?<dl className="mt-3 divide-y divide-[var(--border)]">{exif.map(([key,value])=><div key={key} className="grid gap-1 py-2 sm:grid-cols-[9rem_1fr]"><dt className="text-xs font-medium text-[var(--muted)]">{exifLabels[key] ?? key}</dt><dd className="break-words text-sm text-[var(--foreground)]">{value}</dd></div>)}</dl>:<p className="mt-2 text-sm text-[var(--muted)]">{t.noMetadata}</p>}</div></>}{error&&<p role="alert" className="text-sm font-medium text-[var(--danger)]">{error}</p>}<div className="flex flex-wrap gap-2"><Button type="button" variant="primary" onClick={strip} disabled={!data||busy}>{busy?t.stripping:t.strip}</Button><Button type="button" variant="secondary" onClick={download} disabled={!clean}>{t.download}</Button><ClearButton onClear={reset} disabled={!file&&!data&&!error} label={t.reset}/></div>{clean&&<p role="status" className="text-sm text-[var(--success)]">{t.removed}</p>}</div><div className="flex min-h-72 items-center justify-center border-t border-[var(--border)] pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">{preview?<div className="w-full max-w-md space-y-3"><div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] p-2"><img src={preview} alt={t.preview} className="max-h-80 w-full object-contain"/></div><p className="text-center text-xs text-[var(--muted)]">{data&&data.width+" × "+data.height+" px"}</p></div>:<p className="text-center text-sm text-[var(--muted)]">{t.emptyResult}</p>}</div></div></section>}
function formatBytes(b:number){if(b<1024)return b+" B";const u=["KB","MB","GB"];let v=b,i=-1;while(v>=1024&&i<2){v/=1024;i++}return v.toFixed(v>=100?0:v>=10?1:2)+" "+u[i]}