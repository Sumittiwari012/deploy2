import React, { useEffect, useState } from 'react';
import './SelfCareResources.css';
import article1Img from './assets/article1.jpg';
import article2Img from './assets/article2.jpg';
import article3Img from './assets/article3.jpg';

const articles = [
  {
    category: 'Personality Development',
    title: 'Ways to Feel Happier',
    date: 'Jun 23rd 2025',
    readTime: '7 minutes',
    author: 'Bob Livingstone, LCSW',
    role: 'Social Worker, Writer',
    image: article1Img,
    link: 'https://example.com/anxiety-article',
  },
  {
    category: 'Stress',
    title: 'The Cascade Effect of Emotional Stress',
    date: 'Jun 23rd 2025',
    readTime: '6 minutes',
    author: 'Patrick Nagle',
    role: 'Co-Founder, Director',
    image: article2Img,
    link: 'https://youtube.com/meditation-video',
  },
  {
    category: 'Anger',
    title: 'How Anger Fuels Growth',
    date: 'Jun 18th 2025',
    readTime: '8 minutes',
    author: 'Dr. Robert Fancher Ph.D.',
    role: 'Writer',
    image: article3Img,
    link: 'https://example.com/podcast',
  },
  {
    category: 'Personality Development',
    title: 'Ways to Feel Happier',
    date: 'Jun 23rd 2025',
    readTime: '7 minutes',
    author: 'Bob Livingstone, LCSW',
    role: 'Social Worker, Writer',
    image: article1Img,
    link: 'https://example.com/anxiety-article',
  },
  {
    category: 'Stress',
    title: 'The Cascade Effect of Emotional Stress',
    date: 'Jun 23rd 2025',
    readTime: '6 minutes',
    author: 'Patrick Nagle',
    role: 'Co-Founder, Director',
    image: article2Img,
    link: 'https://youtube.com/meditation-video',
  },
  {
    category: 'Anger',
    title: 'How Anger Fuels Growth',
    date: 'Jun 18th 2025',
    readTime: '8 minutes',
    author: 'Dr. Robert Fancher Ph.D.',
    role: 'Writer',
    image: article3Img,
    link: 'https://example.com/podcast',
  },
];

const quizQuestions = [
  'I feel nervous or on edge.',
  'I have trouble sleeping due to worry.',
  'I feel overwhelmed by daily tasks.',
  'I struggle to relax even in calm environments.',
  'I experience sudden bursts of panic.',
  'I avoid social situations.',
  'I find it hard to focus because of stress.',
  'I get headaches or physical symptoms from stress.',
  'I constantly worry about the future.',
  'I feel emotionally drained most days.',
];

const SelfCareResources = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState(Array(quizQuestions.length).fill(null));
  const [result, setResult] = useState(null);

  useEffect(() => {
    const cards = document.querySelectorAll('.article-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 250);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    cards.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const handleAnswer = (index, value) => {
    const updated = [...answers];
    updated[index] = parseInt(value);
    setAnswers(updated);
  };

  const submitQuiz = () => {
    const total = answers.reduce((acc, val) => acc + (val ?? 0), 0);
    const status = total >= 25 ? 'High Stress' : total >= 15 ? 'Moderate' : 'Low Stress';
    setResult({
      score: total,
      status,
      recommendation: status === 'High Stress'
        ? 'Consider professional therapy to address ongoing challenges.'
        : status === 'Moderate'
        ? 'Try self-care strategies and monitor your feelings.'
        : 'Great! Keep maintaining your well-being.',
    });
  };

  return (
    <div className="resources-container">
      <h1>Mental Health Library</h1>
      <p className="subtitle">Explore our comprehensive library of accurate mental health information.</p>

      <div className="articles-grid">
        {articles.map((article, index) => (
          <a className="article-card" href={article.link} key={index} target="_blank" rel="noreferrer">
            <div className="card-image">
              <img src={article.image} alt={article.title} />
            </div>
            <div className="card-content">
              <span className="category">{article.category}</span>
              <h3>{article.title}</h3>
              <div className="meta">
                <span>📅 {article.date}</span>
                <span>⏱ {article.readTime}</span>
              </div>
              <div className="author">
                <p className="author-name">{article.author}</p>
                <p className="author-role">{article.role}</p>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="quiz-entry-section">
        <h1>Self-Assessment</h1>
        <p className="subtitle">
          <strong>How well do you cope?</strong><br />
          Most people struggle with mental health challenges at some point in life, whether due to circumstances or underlying vulnerabilities and psychiatric conditions.
          This test will give you a sense of how you're coping day to day and whether you might be experiencing symptoms that could be addressed or alleviated via therapy or other professional help.
        </p>

        {!showQuiz ? (
          <button className="quiz-btn" onClick={() => setShowQuiz(true)}>Take Quiz</button>
        ) : (
          <div className="quiz-box">
            <h2 className="quiz-title">Anxiety & Stress Quiz</h2>
            {quizQuestions.map((question, index) => (
              <div key={index} className="likert-question">
                <p>{index + 1}. {question}</p>
                <div className="likert-scale">
                  {[0, 1, 2, 3].map(value => (
                    <label key={value}>
                      <input
                        type="radio"
                        name={`q${index}`}
                        value={value}
                        checked={answers[index] === value}
                        onChange={(e) => handleAnswer(index, e.target.value)}
                      />
                      <span className="circle"></span>
                    </label>
                  ))}
                </div>
                <div className="likert-labels">
                  <span>Never</span>
                  <span>Sometimes</span>
                  <span>Often</span>
                  <span>Always</span>
                </div>
              </div>
            ))}

            <button className="submit-btn" onClick={submitQuiz}>Get Results</button>

            {result && (
              <div className="quiz-result">
                <p><strong>Score:</strong> {result.score} / 30</p>
                <p><strong>Status:</strong> {result.status}</p>
                <p><strong>Recommendation:</strong> {result.recommendation}</p>
                <button className="back-btn" onClick={() => {
                  setShowQuiz(false);
                  setResult(null);
                  setAnswers(Array(quizQuestions.length).fill(null));
                }}>← Back</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelfCareResources;
