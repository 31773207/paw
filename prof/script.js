// ===================== DOM READY =====================
document.addEventListener('DOMContentLoaded', function() {

  const tableBody = document.querySelector('#attendanceTable tbody');
  const processBtn = document.getElementById('processBtn');
  const highlightExcellent = document.getElementById('highlightExcellent');
  const resetColors = document.getElementById('resetColors');
  const addForm = document.getElementById('addStudentForm');
  const courseSelect = document.getElementById('courseSelect');
  const groupSelect = document.getElementById('groupSelect');
  const loadAttendanceBtn = document.querySelector('button[onclick="loadAttendanceData()"]');

  // Current selected course and group
  let currentCourse = 'webdev';
  let currentGroup = 'group1';

  // ------------------ COURSE/GROUP SELECTION ------------------
  if (courseSelect && groupSelect && loadAttendanceBtn) {
    // Update current selection when dropdowns change
    courseSelect.addEventListener('change', function() {
      currentCourse = this.value;
    });

    groupSelect.addEventListener('change', function() {
      currentGroup = this.value;
    });

    // Replace the inline onclick with proper event listener
    loadAttendanceBtn.onclick = function() {
      loadAttendanceData();
    };
  }

  // ------------------ LOAD ATTENDANCE DATA ------------------
  function loadAttendanceData() {
    if (!tableBody) return;
    
    // Update current selections
    if (courseSelect) currentCourse = courseSelect.value;
    if (groupSelect) currentGroup = groupSelect.value;

    // Show loading state
    tableBody.innerHTML = '<tr><td colspan="20" style="text-align:center; padding:20px;">Loading attendance data...</td></tr>';

    // Load students for selected course and group
    fetch(`../db/get_students.php?course=${currentCourse}&group=${currentGroup}`)
      .then(res => res.json())
      .then(students => {
        populateAttendanceTable(students);
      })
      .catch(err => {
        console.error('Load attendance error:', err);
        tableBody.innerHTML = '<tr><td colspan="20" style="text-align:center; color:red; padding:20px;">Error loading data</td></tr>';
      });
  }

  // ------------------ POPULATE ATTENDANCE TABLE ------------------
  function populateAttendanceTable(students) {
    if(!tableBody) return;
    tableBody.innerHTML = '';

    students.forEach(student => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${student.id}</td>
        <td>${student.lastName}</td>
        <td>${student.firstName}</td>
        ${student.scores.map(s => `<td contenteditable="true">${s || ''}</td>`).join('')}
        <td></td><td></td><td></td>
        <td><button class="delete-btn" data-id="${student.id}" style="color:red;">❌</button></td>
      `;
      tableBody.appendChild(row);

      // ------------------ CLICKABLE SCORE CELLS ------------------
      for(let i = 3; i < 3 + student.scores.length; i++){
        row.cells[i].addEventListener('click', function() {
          const val = row.cells[i].textContent === '' ? '✓' : '';
          row.cells[i].textContent = val;

          fetch('../db/update_score.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              studentId: student.id,
              course: currentCourse,
              group: currentGroup,
              session: i - 3,
              value: val
            })
          }).catch(err => console.error('Update score error:', err));
        });
      }
    });

    // Update table header to show current selection
    updateTableHeader();
  }

  // ------------------ UPDATE TABLE HEADER ------------------
  function updateTableHeader() {
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle && courseSelect && groupSelect) {
      const courseName = courseSelect.options[courseSelect.selectedIndex].text;
      const groupName = groupSelect.options[groupSelect.selectedIndex].text;
      pageTitle.textContent = `Attendance List - ${courseName} - ${groupName}`;
    }
  }

  // ------------------ LOAD STUDENTS (Original - keep for compatibility) ------------------
  function loadStudents() {
    if(!tableBody) return;
    tableBody.innerHTML = '';

    fetch('../db/get_students.php')
      .then(res => res.json())
      .then(students => {
        students.forEach(student => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.lastName}</td>
            <td>${student.firstName}</td>
            ${student.scores.map(s => `<td contenteditable="true">${s || ''}</td>`).join('')}
            <td></td><td></td><td></td>
            <td><button class="delete-btn" data-id="${student.id}" style="color:red;">❌</button></td>
          `;
          tableBody.appendChild(row);

          // ------------------ CLICKABLE SCORE CELLS ------------------
          for(let i=3; i<3+student.scores.length; i++){
            row.cells[i].addEventListener('click', function() {
              const val = row.cells[i].textContent === '' ? '✓' : '';
              row.cells[i].textContent = val;

              fetch('../db/update_score.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  studentId: student.id,
                  session: i-3,
                  value: val
                })
              }).catch(err => console.error('Update score error:', err));
            });
          }
        });
      })
      .catch(err => console.error('Load students error:', err));
  }

  // Load initial data
  loadAttendanceData();

  // ------------------ ADD STUDENT ------------------
  if(addForm){
    addForm.addEventListener('submit', function(e){
      e.preventDefault();

      const id = document.getElementById('studentId').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      const firstName = document.getElementById('firstName').value.trim();
      const email = document.getElementById('email').value.trim();

      // VALIDATION
      let valid = true;
      const idError = document.getElementById('idError');
      const lastNameError = document.getElementById('lastNameError');
      const firstNameError = document.getElementById('firstNameError');
      const emailError = document.getElementById('emailError');

      idError.textContent = lastNameError.textContent = firstNameError.textContent = emailError.textContent = '';

      if(id === "" || !/^[0-9]+$/.test(id)){ idError.textContent = "Student ID must contain only numbers."; valid=false; }
      if(lastName === "" || !/^[A-Za-z]+$/.test(lastName)){ lastNameError.textContent = "Last name must contain only letters."; valid=false; }
      if(firstName === "" || !/^[A-Za-z]+$/.test(firstName)){ firstNameError.textContent = "First name must contain only letters."; valid=false; }
      if(email === "" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ emailError.textContent = "Invalid email format."; valid=false; }

      if(valid){
        fetch('../db/add_student.php', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ 
            id, 
            lastName, 
            firstName, 
            email,
            course: currentCourse,
            group: currentGroup 
          })
        })
        .then(res=>res.json())
        .then(data=>{
          if(data.success){
            alert('✅ Student added successfully!');
            addForm.reset();
            loadAttendanceData(); // Reload with current filters
          } else {
            alert('❌ Error: '+data.message);
          }
        })
        .catch(err=>console.error('Add student error:', err));
      }
    });
  }

  // ------------------ DELETE STUDENT ------------------
  if(tableBody){
    tableBody.addEventListener('click', function(e){
      if(e.target.classList.contains('delete-btn')){
        const id = e.target.getAttribute('data-id');
        if(confirm('Are you sure you want to delete this student?')){
          fetch('../db/delete_student.php', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ 
              id,
              course: currentCourse,
              group: currentGroup 
            })
          })
          .then(res=>res.json())
          .then(data=>{
            if(data.success){
              e.target.closest('tr').remove();
              alert('Student deleted ✔');
            } else {
              alert('❌ Error: '+data.message);
            }
          })
          .catch(err=>console.error('Delete student error:', err));
        }
      }
    });
  }

  // ------------------ PROCESS ATTENDANCE ------------------
  if(processBtn){
    processBtn.addEventListener('click', function(){
      const rows = tableBody.querySelectorAll('tr');

      rows.forEach(row=>{
        const cells = row.querySelectorAll('td');
        let absences = 0;
        let participations = 0;

        for(let i=3;i<=14;i+=2){
          const attended = cells[i].textContent.trim();
          const participated = cells[i+1].textContent.trim();
          if(attended==="") absences++;
          if(participated==="✅") participations++;
        }

        cells[16].textContent = absences;
        cells[15].textContent = Math.round((participations/6)*100)+'%';

        if(absences<3) row.style.backgroundColor='#b3ffb3';
        else if(absences<=4) row.style.backgroundColor='#ffff99';
        else row.style.backgroundColor='#ff9999';

        let message='';
        if(absences<3 && participations>=5) message='Good attendance – Excellent participation';
        else if(absences>=3 && absences<=4) message='Warning – attendance low – You need to participate more';
        else message='Excluded – too many absences – You need to participate more';

        cells[17].textContent = message;
      });
    });
  }

  // ------------------ HIGHLIGHT & RESET ------------------
  if(highlightExcellent){
    highlightExcellent.addEventListener('click', function(){
      tableBody.querySelectorAll('tr').forEach(row=>{
        const absences = parseInt(row.cells[16].textContent);
        if(!isNaN(absences) && absences<3){
          row.style.outline='3px solid #00b3b3';
          row.style.backgroundColor='#b3ffb3';
        }
      });
    });
  }

  if(resetColors){
    resetColors.addEventListener('click', function(){
      tableBody.querySelectorAll('tr').forEach(row=>{
        row.style.backgroundColor='';
        row.style.outline='';
      });
    });
  }


  // ================== ATTENDANCE REPORT ==================
// ================== ATTENDANCE REPORT ==================
function updateReport() {
    // read students from localStorage
    const students = JSON.parse(localStorage.getItem('students')) || [];
    
    let totalStudents = students.length;
    let studentsPresent = 0;       // at least one session filled
    let studentsParticipated = 0;  // more than 50% sessions present
    let studentsExcluded = 0;      // too many absences (>=5)
  
    students.forEach(student => {
      const row = student.rowData; // we will store this later if needed
      let presentCount = 0;
  
      // S1-S6 data stored in student.scores (optional, if dynamic)
      if(student.scores){
        student.scores.forEach(mark => {
          if(mark !== "") presentCount++;
        });
      }
  
      if(presentCount > 0) studentsPresent++;
      if(presentCount >= 3) studentsParticipated++; // participated >=50% sessions
      if(presentCount <= 1) studentsExcluded++;
    });
  
    // Update HTML
    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('studentsPresent').textContent = studentsPresent;
    document.getElementById('studentsParticipated').textContent = studentsParticipated;
    document.getElementById('studentsExcluded').textContent = studentsExcluded;
  
    // draw chart
    drawReportChart(totalStudents, studentsPresent, studentsParticipated, studentsExcluded);
}

// for raport chart
function drawReportChart(total, present, participated, excluded) {
    const ctx = document.getElementById('reportChart').getContext('2d');
  
    // destroy old chart if exists
    if(window.myChart) window.myChart.destroy();
  
    window.myChart = new Chart(ctx, {
      type: 'bar',  // bar chart for clear visualization
      data: {
        labels: ['Total Students', 'Present', 'Participated', 'Excluded'], //show under each bar
        datasets: [{
          label: 'Attendance Statistics',
          data: [total, present, participated, excluded],
          backgroundColor: ['#D75858','#51BBCC','#b3ffb3','#ff9999'],
          borderColor: ['#D75858','#51BBCC','#b3ffb3','#ff9999'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Attendance Report'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            stepSize: 1
          }
        }
      }
    });
}

// Initialize the report when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Reports page loaded');
    
    // Try to load and display report data immediately
    updateReport();
    
    // If no data in localStorage, use demo data
    const students = JSON.parse(localStorage.getItem('students')) || [];
    if (students.length === 0) {
        console.log('No students found in localStorage, using demo data');
        // You can add demo data here if needed, or leave it empty
    }
});

// Make function globally available
window.updateReport = updateReport;








}); // DOMContentLoaded end
