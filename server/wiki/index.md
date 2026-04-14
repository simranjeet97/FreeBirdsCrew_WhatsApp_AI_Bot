# Wiki Index

Master index of all knowledge pages in this wiki. The bot reads this first to identify relevant pages for each query.

---

## Pages

| Page | Summary | Best for queries about... |
|------|---------|--------------------------|
| [about_simranjeet.md](./about_simranjeet.md) | Who Simranjeet is — background, expertise, all social links | "Who are you?", "Tell me about Simranjeet", general intro |
| [github_projects.md](./github_projects.md) | All GitHub repos with stars, URLs, descriptions, topic tags | "GitHub projects", "source code", "repos", specific project names |
| [youtube_content.md](./youtube_content.md) | All YouTube playlists with URLs and what they teach | "YouTube videos", "tutorials", "watch", "learn", specific playlist topics |
| [medium_blogs.md](./medium_blogs.md) | Medium blog profile and topics covered | "blogs", "articles", "writing", "Medium" |
| [topmate_booking.md](./topmate_booking.md) | Booking links and when to recommend Quick Connect vs 1:1 | "call", "connect", "mentorship", "guidance", "talk to you", "book" |
| [concepts_knowledge.md](./concepts_knowledge.md) | Deep knowledge on GenAI/LLM/RAG/Agentic AI/Fine-tuning/DataScience/ML | Technical concept questions, "what is RAG", "how does LLM work", "machine learning" |
| [research_papers.md](./research_papers.md) | Important Research Papers in AI/ML space | "research paper", "attention is all you need", "RAG paper" |
| [interview_questions.md](./interview_questions.md) | Interview preparation questions and tips | "interview questions", "how to prepare for AI interview" |
| [SCHEMA.md](./SCHEMA.md) | Bot behavior schema and response guidelines | Internal use — not for query responses |
| [log.md](./log.md) | Interaction log | Internal use — not for query responses |

---

## Intent → Pages Mapping

| User Intent | Load These Pages |
|------------|-----------------|
| `about` | about_simranjeet.md |
| `github_projects` | github_projects.md + about_simranjeet.md |
| `youtube_content` | youtube_content.md + github_projects.md |
| `medium_blogs` | medium_blogs.md + about_simranjeet.md |
| `topmate_booking` | topmate_booking.md |
| `concepts` | concepts_knowledge.md + github_projects.md + youtube_content.md |
| `research_papers` | research_papers.md + youtube_content.md |
| `interview` | interview_questions.md + youtube_content.md |
| `mentorship` | topmate_booking.md + about_simranjeet.md |
| `general` | about_simranjeet.md + github_projects.md |

---

## Last Updated
2026-04-14 — Added support for Interview Questions and Research Papers following LLM Wiki Idea.
