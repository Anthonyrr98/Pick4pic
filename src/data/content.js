export const profile = {
  name: '赵荣力',
  motto: '每年都有惊喜，翻阅快乐！',
  tagline: '好好地记录时间，拥抱成长。',
}

export const navigationTabs = [
  { path: '/', labelKey: 'home' },
  { path: '/articles', labelKey: 'articles' },
  { path: '/life', labelKey: 'dailyLife' },
  { path: '/about', labelKey: 'about' },
  { path: '/peace', labelKey: 'peace' },
  { path: '/tools', labelKey: 'tools' },
]

export const timelineEntries = [
  {
    year: 1998,
    title: '和这个世界打招呼',
    description: '在山谷小镇出生，家人说我总在笑。',
    image:
      'https://images.unsplash.com/photo-1503453634506-0ec74d06ab5d?auto=format&fit=crop&w=500&q=60',
    content: [
      '那是一个春天的午后，我来到了这个世界。',
      '家人说，从我出生的那一刻起，就总是带着笑容。也许这就是我性格的起点吧。',
      '山谷小镇的生活简单而美好，每天都能听到鸟鸣，看到远山。这些记忆虽然模糊，但那种温暖的感觉一直伴随着我。',
    ],
    tags: ['出生', '童年', '回忆'],
  },
  {
    year: 2004,
    title: '第一次站上舞台',
    description: '小学文艺汇演，紧张到忘词仍被大家记住。',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=500&q=60',
    content: [
      '小学四年级的文艺汇演，我被选为班级代表上台表演。',
      '站在舞台上的那一刻，灯光打在我脸上，台下是黑压压的观众。我紧张得手心出汗，准备好的台词突然忘得一干二净。',
      '但奇怪的是，我没有逃跑，而是即兴发挥，说了一些心里话。虽然不完美，但那份真诚打动了大家。',
      '从那以后，我明白了：有时候，真实比完美更重要。',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=60',
      'https://images.unsplash.com/photo-1503453634506-0ec74d06ab5d?auto=format&fit=crop&w=600&q=60',
    ],
    tags: ['舞台', '成长', '勇气'],
  },
  {
    year: 2011,
    title: '独自远行',
    description: '赴北方求学，开始爱上摄影与写作。',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&q=60',
  },
  {
    year: 2013,
    title: '与科学结缘',
    description: '实验室的第一篇论文，带来坚持的力量。',
    image:
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=500&q=60',
  },
  {
    year: 2016,
    title: '城市漫游者',
    description: '在成都短暂工作，记录下街头巷尾的味道。',
    image:
      'https://images.unsplash.com/photo-1455906876003-298dd8c44cab?auto=format&fit=crop&w=500&q=60',
  },
  {
    year: 2017,
    title: '研究生毕业',
    description: '第一次在台上答辩，感谢团队的鼓励。',
    image:
      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=500&q=60',
  },
  {
    year: 2019,
    title: '探索创作',
    description: '开启视频记录计划，尝试Vlog和播客。',
    image:
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=500&q=60',
  },
  {
    year: 2021,
    title: '第一本自出版书',
    description: '把十年的文字整理成册，寄给朋友们。',
    image:
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=500&q=60',
  },
  {
    year: 2023,
    title: '在路上',
    description: '走遍川藏线，体会山河辽阔与自我对话。',
    image:
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=500&q=60',
  },
  {
    year: 2025,
    title: '继续写博客',
    description: 'Pick4pic 正式上线，记录我的生活与灵感。',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=500&q=60',
  },
]

export const introNotes = [
  '记录照片和文字，给未来的自己看。',
  '追踪材料模拟与写作之间的奇妙联系。',
  '持续学习、保持输出，让世界认识更真实的我。',
  '分享旅途、美食、手作、运动的日常灵感。',
  '相信微小的热爱可以累积成巨大的惊喜。',
]

export const articles = [
  {
    id: 'slurm',
    title: 'Materials Studio在Slurm系统上提交实验',
    date: '2023年5月3日 · 研究',
    summary: '打通材料模拟与集群调度，附自动化脚本。',
    image:
      'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=900&q=60',
    rating: 5,
    tag: 'Materials Studio Slurm脚本',
    content: [
      '在使用 Materials Studio 进行材料模拟时，经常需要在集群上提交大量计算任务。手动提交不仅效率低，还容易出错。',
      '本文介绍如何使用 Slurm 系统批量提交 Materials Studio 任务，并提供了完整的自动化脚本。',
      '脚本支持任务队列管理、自动重试、结果收集等功能，大大提高了研究效率。',
    ],
    code: `#!/bin/bash
# Materials Studio Slurm 提交脚本
#SBATCH --job-name=ms_calculation
#SBATCH --nodes=1
#SBATCH --ntasks-per-node=1
#SBATCH --time=24:00:00

module load materials-studio
RunMaterialsStudio.sh input.car`,
    links: [
      { title: 'Materials Studio 官方文档', url: 'https://example.com' },
      { title: 'Slurm 使用指南', url: 'https://example.com' },
    ],
  },
  {
    id: 'vasp-code',
    title: '实用教程以及一些代码注释',
    date: '2023年4月29日 · 编程',
    summary: '整理了VASP常用输入模板与能带分析小工具。',
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=60',
    rating: 4,
    tag: 'Vasp使用教程',
  },
  {
    id: 'tibet-travel',
    title: '论冬天去一趟西北是什么体验',
    date: '2023年2月7日 · 旅行',
    summary: '零下20℃的风、日出和拉面店的热气。',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=60',
    rating: 5,
    tag: '青海纪旅',
  },
  {
    id: 'blog-engine',
    title: '快速上线一个博客',
    date: '2022年8月10日 · 博客',
    summary: '使用 Vite + React 构建低维护的内容系统。',
    image:
      'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?auto=format&fit=crop&w=900&q=60',
    rating: 4,
    tag: '博客架构',
  },
  {
    id: 'mountain-park',
    title: '静及山公园',
    date: '2022年4月30日 · 旅行',
    summary: '凌晨登高，记录云海与城市灯光相遇。',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=60',
    rating: 5,
    tag: '呼吸罐区旅札',
  },
  {
    id: 'food-memory',
    title: '花菜米粉：榕城的味道',
    date: '2021年11月28日 · 碗筷',
    summary: '用食物复刻外婆家的下午，细节全记录。',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=60',
    rating: 4,
    tag: '家常食记',
  },
]

export const diaryPosts = [
  {
    id: 'anniversary',
    date: '2025年4月27号',
    title: '这大概就是我的生活吧',
    content: ['我和我女朋友 4 周年啦，1460 days 快乐！', '奶油、蜡烛以及春天夜里的风。'],
    gallery: [
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=60',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=60',
      'https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=600&q=60',
    ],
  },
  {
    id: 'youth-day',
    date: '2025年5月4号',
    title: '五四青年节，去逛漫展吧',
    content: ['和老朋友换装出门，随手拍的胶片疫情后第一次冲洗。'],
    gallery: [
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=60',
      'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=600&q=60',
    ],
  },
  {
    id: 'coffee',
    date: '2025年6月3号',
    title: '开一场深夜咖啡局',
    content: ['和社群朋友分享烘焙豆，顺便聊聊新想法。'],
    gallery: [
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=60',
      'https://images.unsplash.com/photo-1459257868276-5e65389e2722?auto=format&fit=crop&w=600&q=60',
    ],
  },
]

export const aboutMilestones = [
  '材料学博士，研究二维材料的界面行为。',
  '独立运营「Pick4pic」影像志，累计 200+ 文章。',
  '和朋友一起组织社区展览，关注生活方式与科技结合。',
  '喜欢跑步、徒步和厨房实验，也在学习陶艺。',
]

export const peaceNotes = [
  { title: '慢下来', content: '喝杯乌龙，翻翻旧相册，提醒自己曾经走过的路。' },
  { title: '写给未来的信', content: '每季度寄一封信给未来的自己，拆开时总会又哭又笑。' },
  { title: '平凡日常', content: '每周一次无人知晓的散步，只带相机不带手机。' },
]

export const tools = [
  {
    name: '相册编排表',
    description: '整理年度影像、挑选封面和展览尺寸的表格模板。',
    link: 'https://www.notion.so',
  },
  {
    name: '写作提醒器',
    description: 'Chrome 扩展，每天提醒记录 100 字生活感想。',
    link: 'https://chrome.google.com/webstore',
  },
  {
    name: '路线生成器',
    description: '输入目的地即可自动规划慢旅行路线和咖啡店。',
    link: 'https://maphub.net',
  },
  {
    name: '材料实验记录',
    description: '把实验条件、图谱、脚本放在一起的一套模板。',
    link: 'https://airtable.com',
  },
]

export const socialLinks = [
  { name: 'WeChat', icon: '💬', url: '#' },
  { name: 'Bilibili', icon: '📹', url: '#' },
  { name: 'Weibo', icon: '🐦', url: '#' },
  { name: '小红书', icon: '📕', url: '#' },
  { name: 'YouTube', icon: '▶️', url: '#' },
]

