const STORAGE_KEY = "studyboard-data-v1";
const initialData = { courses: [], assignments: [], sessions: 0 };
let data = loadData();
let activeVersion = 1;

const $ = (selector) => document.querySelector(selector);
const courseForm = $("#courseForm");
const assignmentForm = $("#assignmentForm");

function loadData() {
  try { return { ...initialData, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) }; }
  catch { return { ...initialData }; }
}
function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); render(); }
function uid(prefix) { return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`; }
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[char])); }
function formatDate(dateString) { if (!dateString) return "No due date"; return new Date(`${dateString}T12:00:00`).toLocaleDateString(undefined, { month:"short", day:"numeric" }); }
function showToast(message) { const toast = $("#toast"); toast.textContent = message; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 2200); }

function render() {
  renderStats(); renderCourses(); renderCourseOptions(); renderAssignments(); renderEnhanced();
}
function renderStats() {
  const open = data.assignments.filter((item) => item.status !== "done").length;
  const done = data.assignments.filter((item) => item.status === "done").length;
  const completion = data.assignments.length ? Math.round(done / data.assignments.length * 100) : 0;
  const grades = data.courses.filter((course) => course.grade !== null && course.grade !== undefined && String(course.grade).trim() !== "").map((course) => Number(course.grade)).filter((grade) => Number.isFinite(grade));
  $("#courseCount").textContent = data.courses.length;
  $("#openCount").textContent = open;
  $("#openDetail").textContent = open === 1 ? "needs your attention" : "waiting to be planned";
  $("#averageGrade").textContent = grades.length ? `${Math.round(grades.reduce((a, b) => a + b, 0) / grades.length)}%` : "--";
  $("#completionPercent").textContent = `${completion}%`;
  $("#completionBar").style.width = `${completion}%`;
}
function renderCourses() {
  const list = $("#courseList"); $("#courseEmpty").hidden = data.courses.length > 0;
  list.innerHTML = data.courses.map((course) => `<article class="course-item"><div class="course-info"><strong>${escapeHtml(course.name)}</strong><span>${escapeHtml(course.code || "No course code")}</span></div><div class="item-actions"><button class="small-button" data-edit-course="${course.id}" type="button">Edit</button><button class="small-button" data-delete-course="${course.id}" type="button">Delete</button><span class="grade-badge">${course.grade ? `${course.grade}%` : "--"}</span></div></article>`).join("");
}
function renderCourseOptions() {
  const select = $("#assignmentCourse"); const current = select.value;
  select.innerHTML = data.courses.length ? data.courses.map((course) => `<option value="${course.id}">${escapeHtml(course.name)}</option>`).join("") : `<option value="">Add a course first</option>`;
  if (data.courses.some((course) => course.id === current)) select.value = current;
}
function renderAssignments() {
  const search = $("#assignmentSearch").value.toLowerCase().trim(); const filter = $("#assignmentFilter").value;
  const visible = data.assignments.filter((item) => { const course = data.courses.find((entry) => entry.id === item.courseId); const matchesText = `${item.title} ${course?.name || ""}`.toLowerCase().includes(search); return matchesText && (filter === "all" || item.status === filter); });
  $("#assignmentEmpty").hidden = visible.length > 0;
  $("#assignmentList").innerHTML = visible.map((item) => { const course = data.courses.find((entry) => entry.id === item.courseId); const overdue = item.status !== "done" && item.due < new Date().toISOString().slice(0, 10); return `<article class="assignment-item ${item.status === "done" ? "done" : ""}"><span class="priority-dot ${item.priority}"></span><div class="assignment-main"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(course?.name || "Unassigned")} · ${item.priority} priority</span></div><div class="assignment-meta"><span class="due-date ${overdue ? "overdue" : ""}">${overdue ? "Overdue · " : "Due "}${formatDate(item.due)}</span><select class="status-select" data-status-id="${item.id}" aria-label="Change status for ${escapeHtml(item.title)}"><option value="todo" ${item.status === "todo" ? "selected" : ""}>To do</option><option value="progress" ${item.status === "progress" ? "selected" : ""}>In progress</option><option value="done" ${item.status === "done" ? "selected" : ""}>Done</option></select><button class="small-button" data-edit-assignment="${item.id}" type="button">Edit</button><button class="small-button" data-delete-assignment="${item.id}" type="button">Delete</button></div></article>`; }).join("");
}
function renderEnhanced() {
  $("#enhancedStrip").hidden = activeVersion !== 2;
  const next = data.assignments.filter((item) => item.status !== "done").sort((a, b) => a.due.localeCompare(b.due))[0];
  $("#focusMessage").textContent = next ? `Next: ${next.title} · due ${formatDate(next.due)}` : "Add an assignment to see your next focus.";
  $("#sessionCount").textContent = data.sessions;
  $("#weekDots").innerHTML = Array.from({ length: 7 }, (_, index) => `<i class="${index < Math.min(data.sessions, 7) ? "filled" : ""}"></i>`).join("");
}
function openCourse(course) { $("#courseId").value = course?.id || ""; $("#courseName").value = course?.name || ""; $("#courseCode").value = course?.code || ""; $("#courseGrade").value = course?.grade || ""; courseForm.hidden = false; $("#courseName").focus(); }
function openAssignment(item) { $("#assignmentId").value = item?.id || ""; $("#assignmentTitle").value = item?.title || ""; $("#assignmentCourse").value = item?.courseId || data.courses[0]?.id || ""; $("#assignmentDue").value = item?.due || ""; $("#assignmentPriority").value = item?.priority || "medium"; assignmentForm.hidden = false; $("#assignmentTitle").focus(); }

$("#newCourseButton").addEventListener("click", () => openCourse()); $("#emptyCourseButton").addEventListener("click", () => openCourse()); $("#cancelCourseButton").addEventListener("click", () => { courseForm.hidden = true; });
$("#newAssignmentButton").addEventListener("click", () => { if (!data.courses.length) { showToast("Add a course before adding assignments"); openCourse(); return; } openAssignment(); }); $("#emptyAssignmentButton").addEventListener("click", () => $("#newAssignmentButton").click()); $("#cancelAssignmentButton").addEventListener("click", () => { assignmentForm.hidden = true; });
courseForm.addEventListener("submit", (event) => { event.preventDefault(); const id = $("#courseId").value; const course = { id: id || uid("course"), name: $("#courseName").value.trim(), code: $("#courseCode").value.trim(), grade: $("#courseGrade").value }; if (id) data.courses = data.courses.map((entry) => entry.id === id ? course : entry); else data.courses.push(course); courseForm.hidden = true; saveData(); showToast(id ? "Course updated" : "Course added"); });
assignmentForm.addEventListener("submit", (event) => { event.preventDefault(); const id = $("#assignmentId").value; const existing = data.assignments.find((entry) => entry.id === id); const item = { id: id || uid("assignment"), title: $("#assignmentTitle").value.trim(), courseId: $("#assignmentCourse").value, due: $("#assignmentDue").value, priority: $("#assignmentPriority").value, status: existing?.status || "todo" }; if (id) data.assignments = data.assignments.map((entry) => entry.id === id ? item : entry); else data.assignments.push(item); assignmentForm.hidden = true; saveData(); showToast(id ? "Assignment updated" : "Assignment added"); });

document.addEventListener("click", (event) => { const target = event.target; if (target.dataset.editCourse) openCourse(data.courses.find((item) => item.id === target.dataset.editCourse)); if (target.dataset.deleteCourse) { data.courses = data.courses.filter((item) => item.id !== target.dataset.deleteCourse); data.assignments = data.assignments.filter((item) => item.courseId !== target.dataset.deleteCourse); saveData(); showToast("Course deleted"); } if (target.dataset.editAssignment) openAssignment(data.assignments.find((item) => item.id === target.dataset.editAssignment)); if (target.dataset.deleteAssignment) { data.assignments = data.assignments.filter((item) => item.id !== target.dataset.deleteAssignment); saveData(); showToast("Assignment deleted"); } });
document.addEventListener("change", (event) => { if (event.target.dataset.statusId) { const item = data.assignments.find((entry) => entry.id === event.target.dataset.statusId); item.status = event.target.value; saveData(); showToast("Status updated"); } });
$("#assignmentSearch").addEventListener("input", renderAssignments); $("#assignmentFilter").addEventListener("change", renderAssignments);
document.querySelectorAll(".version-button").forEach((button) => button.addEventListener("click", () => { activeVersion = Number(button.dataset.version); document.querySelectorAll(".version-button").forEach((item) => item.classList.toggle("active", item === button)); $("#versionCaption").textContent = `/ version ${activeVersion}`; renderEnhanced(); }));
$("#addSessionButton").addEventListener("click", () => { data.sessions += 1; saveData(); showToast("Study session logged"); }); $("#resetButton").addEventListener("click", () => { if (confirm("Clear all courses and assignments?")) { data = { ...initialData }; saveData(); showToast("Demo data reset"); } });
$("#todayLabel").textContent = new Intl.DateTimeFormat(undefined, { weekday:"short", month:"short", day:"numeric" }).format(new Date()).toUpperCase();
render();