import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";

export const Home = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/api/projects");
      setProjects(data.projects || []);
    } catch (err) {
      if (String(err.message).toLowerCase().includes("token")) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
   
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await apiFetch("/api/projects", {
        method: "POST",
        body: JSON.stringify({ title, description }),
      });
      setTitle("");
      setDescription("");
      loadProjects();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="w-screen min-h-screen flex justify-center items-center bg-gray-100 p-4 bg-amber-400">
      <div className="w-screen md:w-[900px] h-[92vh] md:h-[750px]  ">
        <div className="bg-gray-300 rounded-4xl h-full overflow-hidden bg-purple-300">
          <div className="flex justify-between items-center  py-15 border-b ">
            <div className=" relative left-8">
              <h1 className="text-[2rem] leading-none">Dashboard</h1>
              <p className="text-[1.1rem] text-gray-700">
                Create your new project
              </p>
            </div>
            <button
              className="h-[2.4rem] px-4 rounded-4xl w-[7rem] bg-red-500 hover:bg-red-600 text-whitere relative right-8"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>

          <div className="h-[calc(100%-90px)] overflow-y-auto p-6 flex flex-col gap-6">
            <div className="bg-gray-100 border border-gray-300 rounded-2xl p-5">
              <h2 className="text-[1.4rem] mb-3">Create Project</h2>
              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                <input
                  className="border border-gray-600 h-[2.4rem] w-full px-2 bg-white"
                  placeholder="Project title *"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  className="border border-gray-600 w-full px-2 py-2 bg-white min-h-[90px]"
                  placeholder="Enetr Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <button
                  className={`h-[2.4rem] w-[120px] ${
                    !title.trim()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                  disabled={!title.trim()}
                >
                  Create
                </button>
              </form>
            </div>

            <div className="bg-gray-100 border border-gray-300 rounded-2xl p-5">
              <h2 className="text-[1.4rem] mb-3">My Projects</h2>
              {loading ? (
                <p>Loading...</p>
              ) : projects.length === 0 ? (
                <p>No projects yet</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      className="border border-gray-600 bg-white p-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => navigate(`/projects/${p.id}`)}
                    >
                      <h3 className="font-bold">{p.title}</h3>
                      <p className="text-sm text-gray-600">{p.description}</p>
                      <p className="text-xs mt-2">
                        Role: <b>{p.role}</b>
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
  );
};

