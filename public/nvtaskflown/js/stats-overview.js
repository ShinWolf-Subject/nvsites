// Stats Overview Component
function StatsOverview({ tasks }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const pendingTasks = totalTasks - completedTasks;

  // Calculate overdue tasks
  const today = new Date();
  const overdueTasks = tasks.filter((task) => {
    if (task.status === "done") return false;
    const dueDate = new Date(task.dueDate);
    return dueDate < today;
  }).length;

  return (
    <div className="row mb-4">
      <div className="col-md-3 col-sm-6">
        <StatsCard number={totalTasks} label="Total Tasks" />
      </div>
      <div className="col-md-3 col-sm-6">
        <StatsCard number={completedTasks} label="Completed" />
      </div>
      <div className="col-md-3 col-sm-6">
        <StatsCard number={pendingTasks} label="Pending" />
      </div>
      <div className="col-md-3 col-sm-6">
        <StatsCard number={overdueTasks} label="Overdue" />
      </div>
    </div>
  );
}