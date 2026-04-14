# Concepts Knowledge Base — GenAI / LLM / RAG / Agentic AI

A structured reference on the core concepts Simranjeet teaches and works with.

---

## 🧠 Large Language Models (LLMs)

**What are LLMs?**
Large Language Models are neural networks trained on massive text corpora to understand and generate human language. They use the Transformer architecture with self-attention mechanisms.

**Key concepts:**
- Transformer architecture, attention heads, feed-forward layers
- Pre-training (next-token prediction) vs fine-tuning (instruction following)
- Temperature, top-p sampling, greedy decoding
- Context window and token limits
- Quantization (4-bit, 8-bit) for efficiency

**Learn more:**
- Research Papers Explained: https://www.youtube.com/playlist?list=PLYIE4hvbWhsAwUIHa-hDf9zQSjRpVFUwD
- 75-Day GenAI Challenge: https://github.com/simranjeet97/75DayHard_GenAI_LLM_Challenge

---

## 📚 RAG (Retrieval Augmented Generation)

**What is RAG?**
RAG enhances LLMs by retrieving relevant external content at query time and providing it as context. This allows LLMs to answer questions about documents they weren't trained on, with accurate citations.

**RAG Pipeline:**
1. **Ingestion**: Split documents → generate embeddings → store in vector DB
2. **Retrieval**: Embed query → similarity search → retrieve top-k chunks
3. **Generation**: LLM receives query + retrieved chunks → generates grounded answer

**Key components:**
- Vector databases: FAISS, Chroma, Pinecone, Qdrant, Weaviate
- Embedding models: text-embedding-3-small, sentence-transformers, E5
- Retrieval strategies: dense, sparse (BM25), hybrid
- Advanced RAG: HyDE, re-ranking, multi-hop, RAPTOR, GraphRAG

**Learn more:**
- GitHub: https://github.com/simranjeet97/Learn_RAG_from_Scratch_LLM
- YouTube: https://www.youtube.com/playlist?list=PLYIE4hvbWhsAKSZVAn5oX1k0oGQ6Mnf1d
- Finance RAG: https://github.com/simranjeet97/LLM-RAG_Finance_UseCases

---

## 🤖 Agentic AI / AI Agents

**What are AI Agents?**
AI agents are LLM-powered systems that can reason, plan, use tools, and take actions autonomously to accomplish goals. They go beyond simple chat — they can browse the web, write files, call APIs, and collaborate with other agents.

**Agent Types:**
- **ReAct agents**: Reason-Act loop (think → act → observe → repeat)
- **Plan-and-Execute**: Plan all steps first, then execute
- **Multi-agent**: Multiple specialized agents collaborate (supervisor, executor, researcher, etc.)
- **RAG agents**: Agents that use retrieval as a tool

**Key Frameworks:**
- **LangChain**: Tool use, chains, memory, agent executors
- **LangGraph**: Graph-based multi-agent orchestration (stateful)
- **AutoGen**: Microsoft's conversational multi-agent framework
- **CrewAI**: Role-based multi-agent teams
- **Google ADK**: Google's Agent Development Kit

**Learn more:**
- GitHub (15+ projects): https://github.com/simranjeet97/Awsome_AI_Agents
- Course: https://github.com/simranjeet97/AgenticAI_AIAgents_Course
- YouTube: https://www.youtube.com/playlist?list=PLYIE4hvbWhsAkn8VzMWbMOxetpaGp-p4k

---

## 🔧 LLM Fine-Tuning

**What is Fine-Tuning?**
Adapting a pre-trained LLM on domain-specific or task-specific data to improve performance on that domain.

**Methods (most efficient to least):**
1. **Prompt Engineering / Few-shot** — no training needed
2. **RAG** — no training, add knowledge externally
3. **LoRA / QLoRA** (PEFT) — train low-rank adapter matrices (memory efficient)
4. **Full fine-tuning** — update all parameters (expensive)

**Popular open-source models to fine-tune:**
- Meta Llama 3 / Llama 3.1
- Mistral / Mixtral
- Google Gemma 2
- Qwen 2.5
- Phi-3

**Learn more:**
- YouTube: https://www.youtube.com/playlist?list=PLYIE4hvbWhsAshCovnaHn_e0aDWYMvZu6

---

## 💬 Prompt Engineering

**Key techniques:**
- **Zero-shot**: Just provide the task, no examples
- **Few-shot**: Provide 2-5 input-output examples
- **Chain of Thought (CoT)**: Ask the model to reason step-by-step
- **ReAct**: Combine reasoning + tool use in the prompt
- **System prompts**: Set persona, tone, constraints for the model

---

## 🏗️ GenAI System Design

**Key considerations when building GenAI systems at scale:**
- **Latency**: Streaming, model selection (flash vs pro), caching
- **Cost**: Token budgets, embedding caching, model tiers
- **Accuracy**: RAG quality, prompt design, evaluation
- **Safety**: Guardrails, content filtering, hallucination detection
- **Observability**: Tracing, logging, LangSmith, Arize Phoenix

---

## 📊 Explainable AI / ML (XAI)

**What is XAI?**
Making ML model predictions understandable to humans. Critical for regulated industries (finance, healthcare).

**Key techniques:**
- **SHAP**: Shapley Additive Explanations — feature attribution
- **LIME**: Local Interpretable Model-agnostic Explanations
- **Attention visualization** for transformer models

**Learn more:**
- YouTube: https://www.youtube.com/playlist?list=PLYIE4hvbWhsCQld2zZlsrPbjShUeHrl41

---

## 📊 Data Science & Classical ML

**What is Data Science?**
The field of extracting insights from data using statistics, algorithms, and domain knowledge.

**Key Concepts:**
- **Supervised Learning**: Linear Regression, Logistic Regression, Random Forest, SVM, Gradient Boosting (XGBoost)
- **Unsupervised Learning**: K-Means Clustering, PCA, t-SNE
- **Model Evaluation**: Precision, Recall, F1-Score, ROC-AUC, RMSE, MAE
- **Data Preprocessing**: Feature scaling, imputation, encoding, handling imbalanced data

**Learn more:**
- Complete ML Course: https://github.com/simranjeet97/Complete_Machine_Learning_Course
