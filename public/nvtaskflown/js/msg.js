// Custom Message Modal
function MessageModal() {
  return (
    <div
      className="modal fade"
      id="messageModal"
      tabIndex="-1"
      aria-labelledby="messageModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="messageModalLabel">
              Notification
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body" id="messageModalBody">
            {/* Message will be inserted here */}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}