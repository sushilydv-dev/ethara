import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../utils/api";

export const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [role, setRole] = useState("");
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    due_date: "",
    assigned_to: "",
    priority: "MEDIUM",
  });

  const [invite, setInvite] = useState({ email: "" });

  const load = async () => {
    try {
      const proj = await apiFetch(`/api/projects/${projectId}`);
      setProject(proj.project);
      setRole(proj.role);

      const t = await apiFetch(`/api/tasks?projectId=${projectId}`);
      setTasks(t.tasks || []);

      const m = await apiFetch(`/api/projects/${projectId}/members`);
      setMembers(m.members || []);
    } catch (err) {
      if (String(err.message).toLowerCase().includes("token")) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      alert(err.message);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const createTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      await apiFetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          project_id: Number(projectId),
          title: newTask.title,
          description: newTask.description,
          due_date: newTask.due_date ? newTask.due_date : null,
          assigned_to: newTask.assigned_to ? Number(newTask.assigned_to) : null,
          priority: newTask.priority,
        }),
      });
      setNewTask({
        title: "",
        description: "",
        due_date: "",
        assigned_to: "",
        priority: "MEDIUM",
      });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await apiFetch(`/api/tasks/${taskId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const inviteMember = async (e) => {
    e.preventDefault();
    if (!invite.email.trim()) return;

    try {
      await apiFetch(`/api/projects/${projectId}/members/invite`, {
        method: "POST",
        body: JSON.stringify({ email: invite.email }),
      });
      setInvite({ email: "" });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="w-screen min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="w-screen md:w-[1100px] h-[92vh] md:h-[780px]">
        <div className="bg-gray-200  h-full overflow-hidden bg-purple-300">
          <div className="flex justify-between items-center px-6 py-5 border-b border-gray-300">
            <div>
             
              <h1 className="text-[2rem] leading-none mt-2">
                {project ? project.title : "Project"}
              </h1>
              <p className="text-[1.1rem] text-gray-700">{project?.description}</p>
              <p className="text-xs mt-1">
                Your role: <b>{role}</b>
              </p>
            </div>

            <button
              className="h-[2.4rem] px-4 bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>

          <div className="h-[calc(100%-90px)] overflow-y-auto p-6 flex flex-col gap-6">
            {role === "ADMIN" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-100 border border-gray-300 rounded-2xl p-5">
                  <h2 className="text-[1.4rem] mb-3">Create Task</h2>
                  <form onSubmit={createTask} className="flex flex-col gap-4">
                    <input
                      className="border border-gray-600 h-[2.4rem] w-full px-2 bg-white"
                      placeholder="Task title"
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask((p) => ({ ...p, title: e.target.value }))
                      }
                    />
                    <textarea
                      className="border border-gray-600 w-full px-2 py-2 bg-white min-h-[90px]"
                      placeholder="Description"
                      value={newTask.description}
                      onChange={(e) =>
                        setNewTask((p) => ({ ...p, description: e.target.value }))
                      }
                    />

                    <div className="flex flex-col md:flex-row gap-3">
                      <input
                        className="border border-gray-600 h-[2.4rem] w-full px-2 bg-white"
                        type="date"
                        value={newTask.due_date}
                        onChange={(e) =>
                          setNewTask((p) => ({ ...p, due_date: e.target.value }))
                        }
                      />
                      <select
                        className="border border-gray-600 h-[2.4rem] w-full px-2 bg-white"
                        value={newTask.priority}
                        onChange={(e) =>
                          setNewTask((p) => ({ ...p, priority: e.target.value }))
                        }
                      >
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                      </select>
                    </div>

                    <select
                      className="border border-gray-600 h-[2.4rem] w-full px-2 bg-white"
                      value={newTask.assigned_to}
                      onChange={(e) =>
                        setNewTask((p) => ({ ...p, assigned_to: e.target.value }))
                      }
                    >
                      <option value="">Assign to (optional)</option>
                      {members.map((m) => (
                        <option key={m.user.id} value={m.user.id}>
                          {m.user.username} ({m.role})
                        </option>
                      ))}
                    </select>

                    <button
                      className={`h-[2.4rem] w-[120px] ${
                        !newTask.title.trim()
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                      disabled={!newTask.title.trim()}
                    >
                      Create
                    </button>
                  </form>
                </div>

                <div className="bg-gray-100 border border-gray-300 rounded-2xl p-5">
                  <h2 className="text-[1.4rem] mb-3">Invite Member</h2>
                  <form onSubmit={inviteMember} className="flex flex-col gap-4">
                    <input
                      className="border border-gray-600 h-[2.4rem] w-full px-2 bg-white"
                      placeholder="Member email"
                      value={invite.email}
                      onChange={(e) => setInvite({ email: e.target.value })}
                    />
                    <button
                      className={`h-[ w-[120px] ${
                        !invite.email.trim()
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                      disabled={!invite.email.trim()}
                    >
                      Invite new member
                    </button>
                  </form>
                
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-100 border border-gray-300 rounded-2xl p-5 md:col-span-2">
                <h2 className="text-[1.4rem] mb-3">Tasks</h2>
                {tasks.length === 0 ? (
                  <p>No tasks yet</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {tasks.map((t) => (
                      <div key={t.id} className="border border-gray-600 bg-white p-3">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div>
                            <h3 className="font-bold">
                              {t.title}{" "}
                              {t.overdue ? (
                                <span className="text-red-600 text-xs">
                                  (OVERDUE)
                                </span>
                              ) : null}
                            </h3>
                            <p className="text-sm text-gray-600">{t.description}</p>
                            <p className="text-xs mt-1">
                              Status: <b>{t.status}</b> | Priority:{" "}
                              <b>{t.priority}</b>
                            </p>
                            <p className="text-xs">
                              Assignee:{" "}
                              <b>
                                {t.assignee ? t.assignee.username : "Not assigned"}
                              </b>
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <button
                              className="border border-gray-600 h-[2.1rem] px-3 bg-white hover:bg-gray-50"
                              onClick={() => updateStatus(t.id, "TODO")}
                            >
                              TODO
                            </button>
                            <button
                              className="border border-gray-600 h-[2.1rem] px-3 bg-white hover:bg-gray-50"
                              onClick={() => updateStatus(t.id, "IN_PROGRESS")}
                            >
                              IN
                            </button>
                            <button
                              className="border border-gray-600 h-[2.1rem] px-3 bg-white hover:bg-gray-50"
                              onClick={() => updateStatus(t.id, "DONE")}
                            >
                              DONE
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gray-100 border border-gray-300 rounded-2xl p-5">
                <h2 className="text-[1.4rem] mb-3">Members</h2>
                {members.length === 0 ? (
                  <p>No members</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {members.map((m) => (
                      <div key={m.user.id} className="border border-gray-600 bg-white p-3">
                        <p className="text-sm font-semibold">{m.user.username}</p>
                        <p className="text-xs text-gray-600">{m.user.email}</p>
                        <p className="text-xs">
                          Role: <b>{m.role}</b>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

