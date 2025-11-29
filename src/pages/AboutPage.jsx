import { useEffect, useState } from 'react'
import PageHero from '../components/PageHero'
import { getAboutMilestones, getProfile } from '../services/dataService'

const AboutPage = () => {
  const [aboutMilestones, setAboutMilestones] = useState(getAboutMilestones())
  const [profile, setProfile] = useState(getProfile())

  useEffect(() => {
    const interval = setInterval(() => {
      setAboutMilestones(getAboutMilestones())
      setProfile(getProfile())
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="page">
      <PageHero title="关于我" subtitle="认识我从一句简单的自我介绍开始" />
      <div className="about-card">
        <img
          src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=60"
          alt={profile.name}
          loading="lazy"
        />
        <div>
          <p>
            我是一名材料研究者，也是一个 Vlogger、文字爱好者。白天在实验室里与数据和脚本相伴，晚上把生活写进
            Pick4pic。记录让人踏实，也让人勇敢。
          </p>
          <ul>
            {aboutMilestones.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AboutPage

