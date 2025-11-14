
document.addEventListener('DOMContentLoaded', function() {

  const processBtn = document.getElementById('processBtn');
  const highlightExcellent = document.getElementById('highlightExcellent');
  const resetColors = document.getElementById('resetColors');
  const tableBody = document.querySelector('#attendanceTable tbody');

  processBtn.addEventListener('click', function() {
    const rows = tableBody.querySelectorAll('tr');//all the row of the tab

    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      let absences = 0;
      let participations = 0;

      // Sessions = columns 3 to 8
      for (let i = 3; i <= 14; i += 2) {
        const attended  = cells[i].textContent.trim(); // A column
        const participated = cells[i + 1].textContent.trim(); // P column

          // Count absence → only if ATTENDED is empty
        if (attended === "") absences++;           // count absences
        if (participated === "✓") participations++; // count participation independently

        }

      // Display counts
      cells[16].textContent = absences;
      const participationPercent = Math.round((participations / 6) * 100) + '%';
      cells[15].textContent = participationPercent;


      // Color based on absences
      if (absences < 3) row.style.backgroundColor = '#b3ffb3';
        else if (absences >= 3 && absences <= 4) row.style.backgroundColor = '#ffff99';
        else row.style.backgroundColor = '#ff9999';

      // Message
      let message = '';
      if (absences < 3 && participations >= 5) {
        message = 'Good attendance – Excellent participation';
      } else if (absences >= 3 && absences <= 4) {
        message = 'Warning – attendance low – You need to participate more';
      } else {
        message = 'Excluded – too many absences – You need to participate more';
      }
      cells[17].textContent = message;


  });

  localStorage.setItem('students', JSON.stringify(students));
})

// highlight excellent Button
  
  $(document).ready(function() {

  // ===================== Highlight Excellent Students =====================
  $('#highlightExcellent').click(function() {
  $('#attendanceTable tbody tr').each(function() {
    const row = $(this); // store this row
    const absencesText = row.find('td:eq(16)').text().trim(); // td index 16
    const absences = parseInt(absencesText);

    if (!isNaN(absences) && absences < 3) {
      // Highlight excellent student
      row.css({
        'outline': '3px solid #00b3b3',
        'background-color': '#b3ffb3'
      });

      // Animate: fade out → fade in → repeat
      let step = 0;
      const interval = setInterval(() => {
        if (step < 4) {
          row.fadeTo(150, row.css('opacity') == 1 ? 0.5 : 1);
          step++;
        } else {
          clearInterval(interval);
          row.css('opacity', 1);                  // restore opacity
          row.css('background-color', '#b3ffb3'); // final green
        }
      }, 300);
    } 
  });
});

// ================= Reset Colors Button =================
  $('#resetColors').click(function() {
    $('#attendanceTable tbody tr').each(function() {
      $(this).css({
        'background-color': '',  // remove background
        'outline': ''            // remove outline
      });
    });
  });

});


});



// ================== ADD STUDENT FORM VALIDATION ==================
document.addEventListener('DOMContentLoaded', function() {
  const addForm = document.getElementById('addStudentForm');

  if (addForm) {
    addForm.addEventListener('submit', function (event) {
      event.preventDefault(); // prevent form from submitting for now

      // get inputs
      const id = document.getElementById('studentId').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      const firstName = document.getElementById('firstName').value.trim();
      const email = document.getElementById('email').value.trim();

      // get error divs
      const idError = document.getElementById('idError');
      const lastNameError = document.getElementById('lastNameError');
      const firstNameError = document.getElementById('firstNameError');
      const emailError = document.getElementById('emailError');

      // clear old errors
      idError.textContent = "";
      lastNameError.textContent = "";
      firstNameError.textContent = "";
      emailError.textContent = "";

      let valid = true;

      // validate ID
      if (id === "" || !/^[0-9]+$/.test(id)) {
        idError.textContent = "Student ID must contain only numbers.";
        valid = false;
      }

      // validate Last Name
      if (lastName === "" || !/^[A-Za-z]+$/.test(lastName)) {
        lastNameError.textContent = "Last name must contain only letters.";
        valid = false;
      }

      // validate First Name
      if (firstName === "" || !/^[A-Za-z]+$/.test(firstName)) {
        firstNameError.textContent = "First name must contain only letters.";
        valid = false;
      }

      // validate Email
      if (email === "" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        emailError.textContent = "Invalid email format.";
        valid = false;
      }


      if (valid) {
        // store student in localStorage
const student = { 
  id, 
  lastName, 
  firstName,
  scores: ["", "", "", "", "", ""]  // <== HNA
};
        let students = JSON.parse(localStorage.getItem('students')) || [];
        students.push(student);
        localStorage.setItem('students', JSON.stringify(students));

        alert("✅ Student added successfully!");
        addForm.reset();
      }
    });
  }
});




// ================== DISPLAY STUDENTS IN ATTENDANCE TABLE ==================
document.addEventListener('DOMContentLoaded', function() {
  const tableBody = document.querySelector('#attendanceTable tbody');

  //reads students from localStorage
  if (tableBody) {
    const students = JSON.parse(localStorage.getItem('students')) || [];

    students.forEach((student) => {
        //creates <tr> for each
      const row = document.createElement('tr');
      //adds empty S1–S6 cells (editable)
      row.innerHTML = `
        <td>${student.id}</td>
        <td>${student.lastName}</td>
        <td>${student.firstName}</td>
<td contenteditable="true">${student.scores?.[0] || ""}</td>
        <td contenteditable="true">${student.scores?.[1] || ""}</td>
        <td contenteditable="true">${student.scores?.[2] || ""}</td>
        <td contenteditable="true">${student.scores?.[3] || ""}</td>
        <td contenteditable="true">${student.scores?.[4] || ""}</td>
        <td contenteditable="true">${student.scores?.[5] || ""}</td>
        <td contenteditable="true">${student.scores?.[6] || ""}</td>
        <td contenteditable="true">${student.scores?.[7] || ""}</td>
        <td contenteditable="true">${student.scores?.[8] || ""}</td>
        <td contenteditable="true">${student.scores?.[9] || ""}</td>
        <td contenteditable="true">${student.scores?.[10] || ""}</td>
        <td contenteditable="true">${student.scores?.[11] || ""}</td>
        <td></td>
        <td></td>
        <td></td>

      <td><button class="delete-btn" data-id="${student.id}" style="color:red;">❌</button></td>

      `;
      tableBody.appendChild(row);

      // Make S1–S6 cells clickable to mark "X"
      for (let i = 3; i <= 14; i++) {
  const cell = row.cells[i];
  cell.addEventListener('click', function() {
    const studentId = row.cells[0].textContent.trim();
    const studentIndex = students.findIndex(s => s.id === studentId);
    if(studentIndex !== -1){
      if (cell.textContent.trim() === '') {
        cell.textContent = '✓';
        students[studentIndex].scores[i-3] = '✓'; // update score in array
      } else {
        cell.textContent = '';
        students[studentIndex].scores[i-3] = '';
      }
      localStorage.setItem('students', JSON.stringify(students)); // save
    }
  });
}



// ======================= DELETE STUDENT =============================
  tableBody.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {

      const id = e.target.getAttribute("data-id");
      let students = JSON.parse(localStorage.getItem("students")) || [];

      students = students.filter(s => s.id != id);
      localStorage.setItem("students", JSON.stringify(students));

      e.target.closest("tr").remove();

      alert("Student deleted ✔");
    }   });
     

    });
  }
});




// =============================== HOVER & CLICK jQuery ========================================
$(document).ready(function() {
  // Select all table rows in the attendance table
  $('#attendanceTable tbody tr').each(function() {
    const $row = $(this);

    // Store original background color (if already colored by processBtn)
    const originalColor = $row.css('background-color');

    //Highlight on hover, remove highlight on mouse leave
    $row.hover(
      function() { // mouse enter
        $row.css('background-color', '#cceeff'); // light blue
      },
      function() { // mouse leave
        // restore color based on absences
        const absences = parseInt($row.find('td:eq(16)').text());
        if (absences < 3) $row.css('background-color', '#b3ffb3'); // green
        else if (absences >= 3 && absences <= 4) $row.css('background-color', '#ffff99'); // yellow
      //else $(this).css('background-color', '#459AA6'); // red
      $(this).removeClass('hovered'); // remove hover class     
       }
    );

  });
});



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
// for raport chat
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
