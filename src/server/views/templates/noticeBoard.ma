<main>
<h3>Notice Board</h3>
    <div id="notice-list">

      <p id="comment"></p>
        <div id="table_wrapper">
          <table id="manage-notices-table">
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Schedule</th>
              <th>Content</th>
              <th>Author</th>
              <th>Delete</th>
            </tr>
          </table>
        </div>
        <button id="new-notice">New Notice</button>
        <div id="add-notice-wrapper">
          <form id="add-notice" method="POST" onsubmit="newNotice()">
            <label for="new-title">Title</label>
            <input type="text" id="new-title">
            <label for="new-content">Content</label>
            <input type="textarea" id="new-content">

            <label for="new-sun">Sun</label>
              <input type="checkbox" id="new-sun" name="day" value="sun">
            <label for="new-mon">Mon</label>
              <input type="checkbox" id="new-mon" name="day" value="mon">
            <label for="new-tue">Tue</label>
              <input type="checkbox" id="new-tue" name="day" value="tue">
            <label for="new-wed">Wed</label>
              <input type="checkbox" id="new-wed" name="day" value="wed">
            <label for="new-thu">Thu</label>
              <input type="checkbox" id="new-thu" name="day" value="thu">
            <label for="new-fri">Fri</label>
              <input type="checkbox" id="new-fri" name="day" value="fri">
            <label for="new-sat">Sat</label>
              <input type="checkbox" id="new-sat" name="day" value="sat">

            <div id="new-targets"></div>

            <input type="submit">
          </form>
        </div>
    </div>
</main>
