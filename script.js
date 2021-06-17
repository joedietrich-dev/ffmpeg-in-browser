const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });
const transcode = async ({ target: { files } }) => {
  const { name } = files[0];
  await ffmpeg.load();
  ffmpeg.FS('writeFile', name, await fetchFile(files[0]));
  await ffmpeg.run('-i', name, '-c:v', 'libx264', '-preset', 'slow', '-crf', '25', '-vf', 'scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:-1:-1:color=black', '-c:a', 'copy', 'output.mp4');
  const data = ffmpeg.FS('readFile', 'output.mp4');
  const video = document.querySelector('#player');
  video.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
}

document.querySelector('#uploader').addEventListener('change', transcode);