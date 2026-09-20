"use client";

import {
  useState,
  type KeyboardEvent,
  type FormEvent,
} from "react";

type Page =
  | "dashboard"
  | "agent"
  | "projects"
  | "files"
  | "settings";

type Project = {
  id: number;
  name: string;
  description: string;
};

type FileItem = {
  id: number;
  name: string;
  type: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [page, setPage] = useState<Page>("dashboard");
  const [aiOpen, setAiOpen] = useState(true);

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Website Builder",
      description: "Build and experiment with websites.",
    },
    {
      id: 2,
      name: "AI Assistant",
      description: "Your Agentic AI workspace.",
    },
  ]);

  const [files, setFiles] = useState<FileItem[]>([
    {
      id: 1,
      name: "index.html",
      type: "HTML",
    },
    {
      id: 2,
      name: "style.css",
      type: "CSS",
    },
    {
      id: 3,
      name: "script.js",
      type: "JavaScript",
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your OpenAI Agent. Ask me to build a website, write code, debug something, or explain a programming concept.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] =
    useState("");

  const [fileSearch, setFileSearch] = useState("");

  async function sendMessage() {
    const text = input.trim();

    if (!text || loading) return;

    const userMessage: Message = {
      role: "user",
      content: text,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          history: messages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "OpenAI request failed."
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            data?.response ||
            "OpenAI returned no response.",
        },
      ]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong.";

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: `Error: ${message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  function clearChat() {
    setMessages([]);
  }

  function newChat() {
    setMessages([
      {
        role: "assistant",
        content:
          "New chat started. What would you like me to build?",
      },
    ]);
  }

  function createProject(event: FormEvent) {
    event.preventDefault();

    const name = newProjectName.trim();

    if (!name) return;

    const project: Project = {
      id: Date.now(),
      name,
      description:
        newProjectDescription.trim() ||
        "New Agentic UI project.",
    };

    setProjects((previous) => [
      ...previous,
      project,
    ]);

    setNewProjectName("");
    setNewProjectDescription("");
    setShowProjectModal(false);
  }

  function deleteProject(id: number) {
    setProjects((previous) =>
      previous.filter((project) => project.id !== id)
    );
  }

  function createFile() {
    const name = window.prompt(
      "Enter the file name:"
    );

    if (!name?.trim()) return;

    const cleanName = name.trim();

    const extension =
      cleanName.split(".").pop()?.toUpperCase() ||
      "FILE";

    setFiles((previous) => [
      ...previous,
      {
        id: Date.now(),
        name: cleanName,
        type: extension,
      },
    ]);
  }

  function deleteFile(id: number) {
    setFiles((previous) =>
      previous.filter((file) => file.id !== id)
    );
  }

  const filteredFiles = files.filter((file) =>
    file.name
      .toLowerCase()
      .includes(fileSearch.toLowerCase())
  );

  return (
    <main className={darkMode ? "app dark" : "app"}>
      {/* SIDEBAR */}

      <aside className="sidebar">
        <div className="brand">
          <div className="brandIcon">✦</div>

          <div>
            <div className="brandName">
              AGENTIC
            </div>

            <div className="brandSub">
              OPENAI
            </div>
          </div>
        </div>

        <nav className="navigation">
          <button
            className={
              page === "dashboard"
                ? "navItem active"
                : "navItem"
            }
            onClick={() => setPage("dashboard")}
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className={
              page === "agent"
                ? "navItem active"
                : "navItem"
            }
            onClick={() => setPage("agent")}
          >
            <span>✦</span>
            Agent
          </button>

          <button
            className={
              page === "projects"
                ? "navItem active"
                : "navItem"
            }
            onClick={() => setPage("projects")}
          >
            <span>◈</span>
            Projects
          </button>

          <button
            className={
              page === "files"
                ? "navItem active"
                : "navItem"
            }
            onClick={() => setPage("files")}
          >
            <span>▣</span>
            Files
          </button>

          <button
            className={
              page === "settings"
                ? "navItem active"
                : "navItem"
            }
            onClick={() => setPage("settings")}
          >
            <span>⚙</span>
            Settings
          </button>
        </nav>

        <div className="sidebarBottom">
          <button
            className="aiLaunch"
            onClick={() => setAiOpen(true)}
          >
            <span className="aiLaunchIcon">
              ✦
            </span>

            <span>
              <strong>OpenAI Agent</strong>
              <small>GPT-powered workspace</small>
            </span>

            <span className="onlineDot" />
          </button>

          <div className="userCard">
            <div className="avatar">
              S
            </div>

            <div className="userInfo">
              <strong>User</strong>
              <small>Local workspace</small>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}

      <section className="mainArea">
        <header className="topbar">
          <div>
            <div className="breadcrumb">
              AGENTIC
              <span>/</span>
              {page}
            </div>

            <h1>
              {page === "dashboard" &&
                "Dashboard"}

              {page === "agent" && "AI Agent"}

              {page === "projects" &&
                "Projects"}

              {page === "files" && "Files"}

              {page === "settings" &&
                "Settings"}
            </h1>
          </div>

          <div className="topActions">
            <button
              className="topButton"
              onClick={() => setAiOpen(!aiOpen)}
            >
              ✦
              {aiOpen
                ? "Hide AI"
                : "Open AI"}
            </button>

            <div className="status">
              <span className="statusDot" />
              OpenAI connected
            </div>
          </div>
        </header>

        <div className="content">
          {/* DASHBOARD */}

          {page === "dashboard" && (
            <Dashboard
              projects={projects}
              files={files}
              setPage={setPage}
              setAiOpen={setAiOpen}
            />
          )}

          {/* AGENT */}

          {page === "agent" && (
            <AgentPage
              setAiOpen={setAiOpen}
              setInput={setInput}
            />
          )}

          {/* PROJECTS */}

          {page === "projects" && (
            <section>
              <div className="sectionHeader">
                <div>
                  <h2>Your projects</h2>
                  <p>
                    Create and manage your Agentic
                    projects.
                  </p>
                </div>

                <button
                  className="primaryButton"
                  onClick={() =>
                    setShowProjectModal(true)
                  }
                >
                  + New project
                </button>
              </div>

              <div className="projectGrid">
                {projects.map((project) => (
                  <div
                    className="projectCard"
                    key={project.id}
                  >
                    <div className="projectIcon">
                      ◈
                    </div>

                    <div className="projectContent">
                      <h3>{project.name}</h3>

                      <p>
                        {project.description}
                      </p>
                    </div>

                    <button
                      className="deleteButton"
                      onClick={() =>
                        deleteProject(project.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                ))}

                {projects.length === 0 && (
                  <div className="emptyState">
                    <div className="emptyIcon">
                      ◈
                    </div>

                    <h3>
                      No projects yet
                    </h3>

                    <p>
                      Create your first project
                      to get started.
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* FILES */}

          {page === "files" && (
            <section>
              <div className="sectionHeader">
                <div>
                  <h2>Files</h2>
                  <p>
                    Manage files in your workspace.
                  </p>
                </div>

                <button
                  className="primaryButton"
                  onClick={createFile}
                >
                  + New file
                </button>
              </div>

              <div className="fileToolbar">
                <input
                  value={fileSearch}
                  onChange={(event) =>
                    setFileSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search files..."
                />
              </div>

              <div className="fileList">
                {filteredFiles.map((file) => (
                  <div
                    className="fileRow"
                    key={file.id}
                  >
                    <div className="fileIcon">
                      ▣
                    </div>

                    <div className="fileName">
                      <strong>
                        {file.name}
                      </strong>

                      <small>
                        {file.type}
                      </small>
                    </div>

                    <button
                      className="deleteButton"
                      onClick={() =>
                        deleteFile(file.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                ))}

                {filteredFiles.length === 0 && (
                  <div className="emptyState">
                    <div className="emptyIcon">
                      ▣
                    </div>

                    <h3>
                      No files found
                    </h3>

                    <p>
                      Try a different search.
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* SETTINGS */}

          {page === "settings" && (
            <section>
              <div className="sectionHeader">
                <div>
                  <h2>Settings</h2>
                  <p>
                    Configure your Agentic UI
                    workspace.
                  </p>
                </div>
              </div>

              <div className="settingsList">
                <div className="settingCard">
                  <div>
                    <h3>Dark mode</h3>
                    <p>
                      Use a darker interface across
                      the workspace.
                    </p>
                  </div>

                  <button
                    className={
                      darkMode
                        ? "toggle on"
                        : "toggle"
                    }
                    onClick={() =>
                      setDarkMode(!darkMode)
                    }
                  >
                    <span />
                  </button>
                </div>

                <div className="settingCard">
                  <div>
                    <h3>
                      Notifications
                    </h3>

                    <p>
                      Show workspace notifications.
                    </p>
                  </div>

                  <button
                    className={
                      notifications
                        ? "toggle on"
                        : "toggle"
                    }
                    onClick={() =>
                      setNotifications(
                        !notifications
                      )
                    }
                  >
                    <span />
                  </button>
                </div>

                <div className="settingCard">
                  <div>
                    <h3>AI provider</h3>
                    <p>
                      Your Agent uses the OpenAI
                      API.
                    </p>
                  </div>

                  <div className="providerBadge">
                    <span />
                    OpenAI
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </section>

      {/* AI SIDEBAR */}

      {aiOpen && (
        <aside className="aiSidebar">
          <div className="aiHeader">
            <div className="aiTitle">
              <div className="aiIcon">
                ✦
              </div>

              <div>
                <strong>
                  OpenAI Agent
                </strong>

                <small>
                  GPT-powered assistant
                </small>
              </div>
            </div>

            <div className="aiHeaderActions">
              <button
                title="New chat"
                onClick={newChat}
              >
                +
              </button>

              <button
                title="Clear chat"
                onClick={clearChat}
              >
                ↺
              </button>

              <button
                title="Close"
                onClick={() =>
                  setAiOpen(false)
                }
              >
                ×
              </button>
            </div>
          </div>

          <div className="aiStatus">
            <span className="statusDot" />
            OpenAI API connected
          </div>

          <div className="messages">
            {messages.map(
              (message, index) => (
                <div
                  key={index}
                  className={
                    message.role === "user"
                      ? "message userMessage"
                      : "message assistantMessage"
                  }
                >
                  <div className="messageLabel">
                    {message.role === "user"
                      ? "You"
                      : "Agent"}
                  </div>

                  <div className="messageBubble">
                    {message.content}
                  </div>
                </div>
              )
            )}

            {loading && (
              <div className="message assistantMessage">
                <div className="messageLabel">
                  Agent
                </div>

                <div className="messageBubble loadingBubble">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </div>

          <div className="aiInputArea">
            <textarea
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask OpenAI anything..."
              rows={3}
              disabled={loading}
            />

            <div className="inputBottom">
              <span>
                Enter to send · Shift+Enter
                for newline
              </span>

              <button
                className="sendButton"
                onClick={() =>
                  void sendMessage()
                }
                disabled={
                  loading ||
                  !input.trim()
                }
              >
                {loading ? "..." : "↑"}
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* PROJECT MODAL */}

      {showProjectModal && (
        <div
          className="modalBackdrop"
          onMouseDown={() =>
            setShowProjectModal(false)
          }
        >
          <form
            className="modal"
            onSubmit={createProject}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modalHeader">
              <div>
                <h2>
                  Create project
                </h2>

                <p>
                  Start a new Agentic workspace.
                </p>
              </div>

              <button
                type="button"
                className="closeModal"
                onClick={() =>
                  setShowProjectModal(false)
                }
              >
                ×
              </button>
            </div>

            <label>
              Project name

              <input
                value={newProjectName}
                onChange={(event) =>
                  setNewProjectName(
                    event.target.value
                  )
                }
                placeholder="My website"
                autoFocus
              />
            </label>

            <label>
              Description

              <textarea
                value={newProjectDescription}
                onChange={(event) =>
                  setNewProjectDescription(
                    event.target.value
                  )
                }
                placeholder="What are you building?"
                rows={4}
              />
            </label>

            <div className="modalActions">
              <button
                type="button"
                className="secondaryButton"
                onClick={() =>
                  setShowProjectModal(false)
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primaryButton"
              >
                Create project
              </button>
            </div>
          </form>
        </div>
      )}

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          min-height: 100%;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        body {
          background: #f5f7fb;
        }

        button,
        input,
        textarea {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        .app {
          min-height: 100vh;
          display: flex;
          background:
            radial-gradient(
              circle at 20% 0%,
              rgba(99, 102, 241, 0.09),
              transparent 32%
            ),
            radial-gradient(
              circle at 80% 10%,
              rgba(6, 182, 212, 0.08),
              transparent 30%
            ),
            #f7f8fc;
          color: #111827;
        }

        .app.dark {
          background: #080b12;
          color: #f8fafc;
        }

        /* SIDEBAR */

        .sidebar {
          width: 250px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          border-right: 1px solid #e5e7eb;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(20px);
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .dark .sidebar {
          background: #0d1119;
          border-color: #1f2937;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 4px 10px 28px;
        }

        .brandIcon {
          width: 42px;
          height: 42px;
          border-radius: 13px;
          display: grid;
          place-items: center;
          color: white;
          font-size: 21px;
          background:
            linear-gradient(
              135deg,
              #6366f1,
              #06b6d4
            );
          box-shadow:
            0 8px 24px
              rgba(99, 102, 241, 0.28);
        }

        .brandName {
          font-weight: 900;
          letter-spacing: 1.8px;
          font-size: 15px;
        }

        .brandSub {
          margin-top: 2px;
          font-size: 10px;
          font-weight: 800;
          color: #6366f1;
          letter-spacing: 2px;
        }

        .navigation {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .navItem {
          width: 100%;
          border: 0;
          background: transparent;
          padding: 12px 13px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
          color: #64748b;
          font-weight: 650;
          transition:
            background 0.2s,
            color 0.2s,
            transform 0.2s;
        }

        .navItem span {
          width: 22px;
          text-align: center;
          font-size: 17px;
        }

        .navItem:hover {
          background: #f1f5f9;
          color: #111827;
          transform: translateX(2px);
        }

        .navItem.active {
          background:
            linear-gradient(
              135deg,
              rgba(99, 102, 241, 0.13),
              rgba(6, 182, 212, 0.1)
            );
          color: #4f46e5;
        }

        .dark .navItem {
          color: #94a3b8;
        }

        .dark .navItem:hover {
          background: #151b26;
          color: white;
        }

        .dark .navItem.active {
          color: #a5b4fc;
          background: #171d2b;
        }

        .sidebarBottom {
          margin-top: auto;
        }

        .aiLaunch {
          width: 100%;
          border: 1px solid #dbe3ff;
          background:
            linear-gradient(
              135deg,
              #eef2ff,
              #ecfeff
            );
          border-radius: 15px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 9px;
          text-align: left;
          margin-bottom: 12px;
        }

        .aiLaunchIcon {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          background: #6366f1;
          color: white;
        }

        .aiLaunch strong,
        .aiLaunch small {
          display: block;
        }

        .aiLaunch strong {
          font-size: 12px;
        }

        .aiLaunch small {
          margin-top: 2px;
          color: #64748b;
          font-size: 10px;
        }

        .onlineDot,
        .statusDot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow:
            0 0 0 3px
              rgba(34, 197, 94, 0.12);
        }

        .aiLaunch .onlineDot {
          margin-left: auto;
        }

        .userCard {
          border-top: 1px solid #e5e7eb;
          padding: 15px 7px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dark .userCard {
          border-color: #1f2937;
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background:
            linear-gradient(
              135deg,
              #6366f1,
              #ec4899
            );
          color: white;
          font-weight: 800;
        }

        .userInfo strong,
        .userInfo small {
          display: block;
        }

        .userInfo strong {
          font-size: 12px;
        }

        .userInfo small {
          color: #94a3b8;
          margin-top: 2px;
          font-size: 10px;
        }

        /* MAIN */

        .mainArea {
          min-width: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .topbar {
          min-height: 90px;
          padding: 20px 30px;
          border-bottom: 1px solid #e5e7eb;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .dark .topbar {
          background: #0d1119;
          border-color: #1f2937;
        }

        .breadcrumb {
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 10px;
          font-weight: 800;
        }

        .breadcrumb span {
          margin: 0 8px;
        }

        .topbar h1 {
          margin: 5px 0 0;
          font-size: 25px;
          letter-spacing: -0.7px;
        }

        .topActions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .topButton {
          border: 1px solid #dbe3ff;
          background: white;
          color: #4f46e5;
          border-radius: 10px;
          padding: 9px 13px;
          font-weight: 700;
        }

        .dark .topButton {
          background: #111827;
          border-color: #374151;
          color: #a5b4fc;
        }

        .status {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 12px;
          white-space: nowrap;
        }

        .content {
          padding: 30px;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }

        /* DASHBOARD */

        .hero {
          padding: 34px;
          border-radius: 24px;
          color: white;
          overflow: hidden;
          position: relative;
          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #7c3aed 50%,
              #0891b2
            );
          box-shadow:
            0 20px 50px
              rgba(79, 70, 229, 0.22);
        }

        .hero::after {
          content: "";
          position: absolute;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          right: -80px;
          top: -130px;
          background: rgba(255, 255, 255, 0.12);
        }

        .heroLabel {
          position: relative;
          z-index: 1;
          opacity: 0.8;
          text-transform: uppercase;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .hero h2 {
          position: relative;
          z-index: 1;
          margin: 8px 0;
          font-size: 34px;
          letter-spacing: -1.3px;
        }

        .hero p {
          position: relative;
          z-index: 1;
          max-width: 620px;
          margin: 0;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.7;
        }

        .heroButton {
          position: relative;
          z-index: 1;
          margin-top: 22px;
          border: 0;
          border-radius: 10px;
          background: white;
          color: #4f46e5;
          padding: 11px 16px;
          font-weight: 800;
        }

        .statsGrid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 15px;
          margin-top: 18px;
        }

        .statCard {
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 17px;
          padding: 21px;
        }

        .dark .statCard {
          background: #0d1119;
          border-color: #1f2937;
        }

        .statCard small {
          color: #94a3b8;
          font-weight: 700;
        }

        .statCard strong {
          display: block;
          margin-top: 8px;
          font-size: 30px;
        }

        .quickGrid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 15px;
          margin-top: 18px;
        }

        .quickCard {
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 17px;
          padding: 22px;
          text-align: left;
        }

        .dark .quickCard {
          background: #0d1119;
          border-color: #1f2937;
        }

        .quickCard:hover {
          border-color: #a5b4fc;
          transform: translateY(-2px);
        }

        .quickCardIcon {
          font-size: 24px;
        }

        .quickCard h3 {
          margin: 13px 0 5px;
        }

        .quickCard p {
          margin: 0;
          color: #64748b;
          line-height: 1.6;
          font-size: 13px;
        }

        /* SECTIONS */

        .sectionHeader {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 22px;
        }

        .sectionHeader h2 {
          margin: 0;
          font-size: 24px;
        }

        .sectionHeader p {
          color: #64748b;
          margin: 7px 0 0;
        }

        .primaryButton {
          border: 0;
          border-radius: 10px;
          padding: 11px 16px;
          background:
            linear-gradient(
              135deg,
              #6366f1,
              #06b6d4
            );
          color: white;
          font-weight: 800;
          box-shadow:
            0 8px 20px
              rgba(99, 102, 241, 0.2);
        }

        .secondaryButton {
          border: 1px solid #dbe1ea;
          background: white;
          color: #475569;
          border-radius: 10px;
          padding: 11px 16px;
          font-weight: 700;
        }

        .dark .secondaryButton {
          background: #111827;
          color: #cbd5e1;
          border-color: #374151;
        }

        /* PROJECTS */

        .projectGrid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .projectCard {
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 18px;
          padding: 20px;
          min-height: 180px;
          display: flex;
          flex-direction: column;
        }

        .dark .projectCard {
          background: #0d1119;
          border-color: #1f2937;
        }

        .projectIcon {
          width: 40px;
          height: 40px;
          border-radius: 11px;
          display: grid;
          place-items: center;
          color: #4f46e5;
          background: #eef2ff;
        }

        .projectContent {
          flex: 1;
        }

        .projectContent h3 {
          margin: 17px 0 6px;
        }

        .projectContent p {
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }

        .deleteButton {
          align-self: flex-start;
          border: 0;
          background: #fff1f2;
          color: #e11d48;
          border-radius: 8px;
          padding: 7px 10px;
          font-size: 11px;
          font-weight: 750;
        }

        .dark .deleteButton {
          background: #2a1318;
        }

        /* FILES */

        .fileToolbar {
          margin-bottom: 14px;
        }

        .fileToolbar input {
          width: 100%;
          border: 1px solid #dfe4ec;
          background: white;
          border-radius: 11px;
          padding: 12px 14px;
          outline: none;
        }

        .fileToolbar input:focus,
        .modal input:focus,
        .modal textarea:focus,
        .aiInputArea textarea:focus {
          border-color: #818cf8;
          box-shadow:
            0 0 0 3px
              rgba(99, 102, 241, 0.1);
        }

        .dark .fileToolbar input {
          background: #0d1119;
          color: white;
          border-color: #374151;
        }

        .fileList {
          border: 1px solid #e5e7eb;
          border-radius: 17px;
          overflow: hidden;
          background: white;
        }

        .dark .fileList {
          background: #0d1119;
          border-color: #1f2937;
        }

        .fileRow {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 15px 17px;
          border-bottom: 1px solid #edf0f4;
        }

        .dark .fileRow {
          border-color: #1f2937;
        }

        .fileRow:last-child {
          border-bottom: 0;
        }

        .fileIcon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #ecfeff;
          color: #0891b2;
        }

        .fileName {
          flex: 1;
        }

        .fileName strong,
        .fileName small {
          display: block;
        }

        .fileName small {
          color: #94a3b8;
          margin-top: 3px;
        }

        /* SETTINGS */

        .settingsList {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .settingCard {
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          background: white;
          padding: 21px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .dark .settingCard {
          background: #0d1119;
          border-color: #1f2937;
        }

        .settingCard h3 {
          margin: 0;
        }

        .settingCard p {
          color: #64748b;
          margin: 6px 0 0;
        }

        .toggle {
          width: 48px;
          height: 27px;
          border: 0;
          border-radius: 99px;
          background: #cbd5e1;
          padding: 3px;
        }

        .toggle span {
          display: block;
          width: 21px;
          height: 21px;
          border-radius: 50%;
          background: white;
          transition: transform 0.2s;
        }

        .toggle.on {
          background: #6366f1;
        }

        .toggle.on span {
          transform: translateX(21px);
        }

        .providerBadge {
          display: flex;
          align-items: center;
          gap: 7px;
          border: 1px solid #dbeafe;
          background: #eff6ff;
          color: #2563eb;
          padding: 8px 11px;
          border-radius: 9px;
          font-size: 12px;
          font-weight: 800;
        }

        .providerBadge span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22c55e;
        }

        /* AI SIDEBAR */

        .aiSidebar {
          width: 390px;
          height: 100vh;
          position: sticky;
          top: 0;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border-left: 1px solid #e5e7eb;
          box-shadow:
            -15px 0 40px
              rgba(15, 23, 42, 0.04);
        }

        .dark .aiSidebar {
          background: #0b0f16;
          border-color: #1f2937;
        }

        .aiHeader {
          min-height: 76px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e5e7eb;
        }

        .dark .aiHeader {
          border-color: #1f2937;
        }

        .aiTitle {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .aiIcon {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          display: grid;
          place-items: center;
          color: white;
          background:
            linear-gradient(
              135deg,
              #6366f1,
              #06b6d4
            );
        }

        .aiTitle strong,
        .aiTitle small {
          display: block;
        }

        .aiTitle strong {
          font-size: 13px;
        }

        .aiTitle small {
          color: #94a3b8;
          margin-top: 3px;
          font-size: 10px;
        }

        .aiHeaderActions {
          display: flex;
          gap: 3px;
        }

        .aiHeaderActions button {
          width: 30px;
          height: 30px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #64748b;
          font-size: 18px;
        }

        .aiHeaderActions button:hover {
          background: #f1f5f9;
          color: #111827;
        }

        .dark .aiHeaderActions button:hover {
          background: #17202d;
          color: white;
        }

        .aiStatus {
          margin: 12px 15px;
          padding: 8px 10px;
          border-radius: 8px;
          background: #f0fdf4;
          color: #15803d;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          font-weight: 700;
        }

        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 17px;
        }

        .message {
          margin-bottom: 18px;
        }

        .messageLabel {
          margin-bottom: 5px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          color: #94a3b8;
        }

        .userMessage .messageLabel {
          text-align: right;
        }

        .messageBubble {
          padding: 11px 13px;
          border-radius: 13px;
          line-height: 1.6;
          font-size: 13px;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .assistantMessage .messageBubble {
          background: #f1f5f9;
          color: #1e293b;
          border-top-left-radius: 4px;
        }

        .dark
          .assistantMessage
          .messageBubble {
          background: #17202d;
          color: #e2e8f0;
        }

        .userMessage .messageBubble {
          margin-left: auto;
          max-width: 88%;
          background:
            linear-gradient(
              135deg,
              #6366f1,
              #4f46e5
            );
          color: white;
          border-top-right-radius: 4px;
        }

        .loadingBubble {
          display: flex;
          gap: 4px;
          align-items: center;
          width: fit-content;
        }

        .loadingBubble span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #64748b;
          animation: bounce 1s infinite;
        }

        .loadingBubble span:nth-child(2) {
          animation-delay: 0.15s;
        }

        .loadingBubble span:nth-child(3) {
          animation-delay: 0.3s;
        }

        @keyframes bounce {
          0%,
          60%,
          100% {
            transform: translateY(0);
          }

          30% {
            transform: translateY(-4px);
          }
        }

        .aiInputArea {
          padding: 13px;
          border-top: 1px solid #e5e7eb;
          background: white;
        }

        .dark .aiInputArea {
          background: #0b0f16;
          border-color: #1f2937;
        }

        .aiInputArea textarea {
          width: 100%;
          resize: none;
          outline: none;
          border: 1px solid #dfe4ec;
          background: #f8fafc;
          color: #111827;
          border-radius: 12px;
          padding: 11px;
          min-height: 76px;
          line-height: 1.5;
          font-size: 13px;
        }

        .dark .aiInputArea textarea {
          background: #111827;
          color: white;
          border-color: #374151;
        }

        .inputBottom {
          margin-top: 7px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .inputBottom span {
          color: #94a3b8;
          font-size: 9px;
        }

        .sendButton {
          width: 34px;
          height: 34px;
          border: 0;
          border-radius: 10px;
          background:
            linear-gradient(
              135deg,
              #6366f1,
              #06b6d4
            );
          color: white;
          font-size: 18px;
          font-weight: 800;
        }

        .sendButton:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* EMPTY */

        .emptyState {
          grid-column: 1 / -1;
          text-align: center;
          padding: 70px 20px;
          border: 1px dashed #d7dde7;
          border-radius: 17px;
        }

        .emptyIcon {
          font-size: 30px;
          color: #94a3b8;
        }

        .emptyState h3 {
          margin: 12px 0 5px;
        }

        .emptyState p {
          color: #94a3b8;
          margin: 0;
        }

        /* MODAL */

        .modalBackdrop {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(5px);
          display: grid;
          place-items: center;
          padding: 20px;
        }

        .modal {
          width: min(480px, 100%);
          border-radius: 20px;
          background: white;
          padding: 23px;
          box-shadow:
            0 30px 80px
              rgba(15, 23, 42, 0.2);
        }

        .dark .modal {
          background: #111827;
          color: white;
        }

        .modalHeader {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .modalHeader h2 {
          margin: 0;
        }

        .modalHeader p {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 13px;
        }

        .closeModal {
          width: 32px;
          height: 32px;
          border: 0;
          border-radius: 8px;
          background: #f1f5f9;
          font-size: 20px;
        }

        .modal label {
          display: block;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 15px;
        }

        .modal input,
        .modal textarea {
          display: block;
          width: 100%;
          margin-top: 7px;
          border: 1px solid #dfe4ec;
          border-radius: 10px;
          outline: none;
          padding: 11px;
          background: white;
          color: #111827;
        }

        .modal textarea {
          resize: vertical;
        }

        .dark .modal input,
        .dark .modal textarea {
          background: #0b0f16;
          color: white;
          border-color: #374151;
        }

        .modalActions {
          display: flex;
          justify-content: flex-end;
          gap: 9px;
          margin-top: 20px;
        }

        /* RESPONSIVE */

        @media (max-width: 1100px) {
          .aiSidebar {
            width: 350px;
          }

          .sidebar {
            width: 220px;
          }
        }

        @media (max-width: 850px) {
          .sidebar {
            width: 76px;
            padding: 15px 10px;
          }

          .brand {
            justify-content: center;
            padding-left: 0;
            padding-right: 0;
          }

          .brand > div:last-child {
            display: none;
          }

          .navItem {
            justify-content: center;
          }

          .navItem span {
            width: auto;
          }

          .navItem {
            font-size: 0;
          }

          .sidebarBottom {
            display: none;
          }

          .aiSidebar {
            position: fixed;
            z-index: 50;
            right: 0;
            top: 0;
            width: min(390px, 92vw);
            box-shadow:
              -20px 0 60px
                rgba(15, 23, 42, 0.2);
          }

          .statsGrid,
          .projectGrid,
          .quickGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .topbar {
            padding: 17px;
          }

          .content {
            padding: 17px;
          }

          .topActions .status {
            display: none;
          }

          .hero {
            padding: 25px;
          }

          .hero h2 {
            font-size: 27px;
          }

          .sectionHeader {
            flex-direction: column;
          }

          .primaryButton {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}

/* DASHBOARD COMPONENT */

function Dashboard({
  projects,
  files,
  setPage,
  setAiOpen,
}: {
  projects: Project[];
  files: FileItem[];
  setPage: (page: Page) => void;
  setAiOpen: (open: boolean) => void;
}) {
  return (
    <>
      <section className="hero">
        <div className="heroLabel">
          Agentic workspace
        </div>

        <h2>
          Build with your AI agent.
        </h2>

        <p>
          Create projects, manage files and
          use your OpenAI-powered agent from
          one workspace.
        </p>

        <button
          className="heroButton"
          onClick={() => setAiOpen(true)}
        >
          Open AI Agent →
        </button>
      </section>

      <div className="statsGrid">
        <div className="statCard">
          <small>Projects</small>
          <strong>
            {projects.length}
          </strong>
        </div>

        <div className="statCard">
          <small>Files</small>
          <strong>{files.length}</strong>
        </div>

        <div className="statCard">
          <small>AI provider</small>
          <strong
            style={{
              fontSize: "21px",
            }}
          >
            OpenAI
          </strong>
        </div>
      </div>

      <div className="quickGrid">
        <button
          className="quickCard"
          onClick={() => setPage("agent")}
        >
          <div className="quickCardIcon">
            ✦
          </div>

          <h3>AI Agent</h3>

          <p>
            Talk to your OpenAI agent and
            generate code or ideas.
          </p>
        </button>

        <button
          className="quickCard"
          onClick={() => setPage("projects")}
        >
          <div className="quickCardIcon">
            ◈
          </div>

          <h3>Projects</h3>

          <p>
            Create and manage your projects
            and workspaces.
          </p>
        </button>

        <button
          className="quickCard"
          onClick={() => setPage("files")}
        >
          <div className="quickCardIcon">
            ▣
          </div>

          <h3>Files</h3>

          <p>
            Manage the files associated with
            your workspace.
          </p>
        </button>

        <button
          className="quickCard"
          onClick={() => setPage("settings")}
        >
          <div className="quickCardIcon">
            ⚙
          </div>

          <h3>Settings</h3>

          <p>
            Configure your Agentic UI
            experience.
          </p>
        </button>
      </div>
    </>
  );
}

/* AGENT PAGE */

function AgentPage({
  setAiOpen,
  setInput,
}: {
  setAiOpen: (open: boolean) => void;
  setInput: (value: string) => void;
}) {
  const examples = [
    "Create a modern portfolio website",
    "Build a landing page with HTML and CSS",
    "Explain how React state works",
    "Debug my JavaScript code",
  ];

  return (
    <section>
      <div className="sectionHeader">
        <div>
          <h2>
            OpenAI Agent Workspace
          </h2>

          <p>
            Describe what you want to build
            and let the agent help you.
          </p>
        </div>

        <button
          className="primaryButton"
          onClick={() => setAiOpen(true)}
        >
          Open Agent
        </button>
      </div>

      <div className="quickGrid">
        {examples.map((example) => (
          <button
            className="quickCard"
            key={example}
            onClick={() => {
              setInput(example);
              setAiOpen(true);
            }}
          >
            <div className="quickCardIcon">
              ✦
            </div>

            <h3>{example}</h3>

            <p>
              Send this request to the OpenAI
              agent.
            </p>
          </button>
        ))}
      </div>

      <div
        style={{
          marginTop: 18,
          border: "1px solid #e5e7eb",
          borderRadius: 18,
          background: "white",
          padding: 25,
        }}
      >
        <h3 style={{ marginTop: 0 }}>
          Try the agent
        </h3>

        <p
          style={{
            color: "#64748b",
            lineHeight: 1.7,
          }}
        >
          The AI panel on the right is
          connected to your{" "}
          <strong>OpenAI API</strong>. Use it
          to ask questions, generate code,
          debug problems, or plan your next
          project.
        </p>
      </div>
    </section>
  );
} 
