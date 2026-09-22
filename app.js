const portfolioPdfUrl = './portfolio.pdf'
const bilibiliUrl = (bvid) => `https://player.bilibili.com/player.html?bvid=${bvid}&high_quality=1&quality=80&qn=80&danmaku=0&autoplay=0`
const youtubeUrl = (id) => `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`

const videos = [
  { title: '《心动小镇》联动《潜水员戴夫》过场动画', bvid: 'BV16FtZ6iE7i', eyebrow: '过场动画', category: 'CINEMATIC', description: '项目：《心动小镇》×《潜水员戴夫》联动过场动画\n角色：分镜设计 & 动态叙事执行\n产出：25S游戏内过场片' },
  { title: '新白娘子联动心动小镇PV前期', bvid: 'BV1dpeq6QEu3', eyebrow: 'PROMOTIONAL PV', category: '前期制作', description: '新白娘子联动心动小镇PV前期。' },
  { title: '满分倒霉蛋 · EP01', bvid: 'BV1nfto6TEe4', eyebrow: 'AIGC 短片', category: 'AIGC FILM', description: '第一集《蒲公英的紧急护送》项目说明' },
  { title: '《火炬之光》赛季CG打斗优化片段', bvid: 'BV1dxto6fEBG', eyebrow: '赛季 CG', category: 'ACTION PV', description: '《火炬之光》赛季CG・打斗优化' },
  { title: '2D动画硬币游戏', bvid: 'BV16fto6TEZH', eyebrow: '二维动画', category: '2D ANIMATION', description: '故事梗概与分工情况详见项目说明。' },
  { title: 'Maya动画练习', bvid: 'BV1cfto6MEar', eyebrow: '三维动画', category: 'MAYA ANIMATION', description: 'Maya动画练习。' },
  { title: '手绘动画练习', bvid: 'BV1rfto6TEPV', eyebrow: '二维动画', category: 'HAND-DRAWN ANIMATION', description: '手绘动画练习。' },
]


const directory = document.querySelector('#video-directory')
const modal = document.querySelector('#video-modal')
const player = document.querySelector('#modal-player')
const bilibili = document.querySelector('#modal-bilibili')
const pdf = document.querySelector('#modal-pdf')
const closeButton = document.querySelector('#modal-close')
const previousButton = document.querySelector('#modal-previous')
const nextButton = document.querySelector('#modal-next')
const buttons = []
let selectedIndex = null
let opener = null

const pdfButton = document.createElement('button')
pdfButton.className = 'work-directory__item'
pdfButton.innerHTML = '<span class="work-directory__name">作品集PDF文件</span>'
pdfButton.addEventListener('click', (event) => openPdf(event.currentTarget))
directory.appendChild(pdfButton)

videos.forEach((video, index) => {
  const button = document.createElement('button')
  button.className = 'work-directory__item'
  button.innerHTML = `<span class="work-directory__name">${video.title}</span>`
  button.addEventListener('click', (event) => openVideo(index, event.currentTarget))
  buttons.push(button)
  directory.appendChild(button)
})

function updateState() {
  buttons.forEach((button, index) => button.classList.toggle('is-active', index === selectedIndex))
  pdfButton.classList.toggle('is-active', selectedIndex === null && !modal.hidden)
}

function setText(video, index) {
  document.querySelector('#modal-counter').textContent = `FILM ${String(index + 1).padStart(2, '0')} / ${String(videos.length).padStart(2, '0')}`
  document.querySelector('#modal-eyebrow').textContent = `${video.eyebrow} · ${video.category}`
  document.querySelector('#modal-title').textContent = video.title
  document.querySelector('#modal-description').textContent = video.description
  document.querySelector('#modal-meta').textContent = ''
}

function openVideo(index, trigger) {
  selectedIndex = index; opener = trigger
  const video = videos[index]
  player.pause(); player.hidden = true; player.removeAttribute('src')
  pdf.hidden = true; pdf.removeAttribute('src')
  bilibili.hidden = false; bilibili.src = video.youtubeId ? youtubeUrl(video.youtubeId) : bilibiliUrl(video.bvid)
  setText(video, index); previousButton.hidden = nextButton.hidden = false; updateState(); showModal()
}

function openPdf(trigger) {
  selectedIndex = null; opener = trigger
  player.pause(); player.hidden = true; player.removeAttribute('src')
  bilibili.hidden = true; bilibili.removeAttribute('src')
  pdf.src = `${portfolioPdfUrl}#page=1&zoom=page-width&toolbar=0&navpanes=0`; pdf.hidden = false
  document.querySelector('#modal-counter').textContent = 'PDF'
  document.querySelector('#modal-eyebrow').textContent = 'PORTFOLIO DOCUMENT'
  document.querySelector('#modal-title').textContent = '作品集PDF文件'
  document.querySelector('#modal-description').textContent = '黄诗敏 2026 视频作品集。'
  document.querySelector('#modal-meta').textContent = ''
  previousButton.hidden = nextButton.hidden = true; updateState(); showModal()
}

function showModal() { modal.hidden = false; document.body.style.overflow = 'hidden'; requestAnimationFrame(() => closeButton.focus()) }
function closeModal() { player.pause(); player.removeAttribute('src'); bilibili.removeAttribute('src'); pdf.removeAttribute('src'); pdf.hidden = true; modal.hidden = true; document.body.style.overflow = ''; opener?.focus(); updateState() }
function changeVideo(direction) { selectedIndex = (selectedIndex + direction + videos.length) % videos.length; openVideo(selectedIndex, buttons[selectedIndex]) }

closeButton.addEventListener('click', closeModal)
document.querySelector('#modal-backdrop').addEventListener('click', closeModal)
previousButton.addEventListener('click', () => changeVideo(-1))
nextButton.addEventListener('click', () => changeVideo(1))
document.addEventListener('keydown', (event) => { if (modal.hidden) return; if (event.key === 'Escape') closeModal(); if (event.key === 'ArrowLeft' && selectedIndex !== null) changeVideo(-1); if (event.key === 'ArrowRight' && selectedIndex !== null) changeVideo(1) })
updateState()
