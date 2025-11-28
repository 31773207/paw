// ===================== GLOBAL VARIABLES =====================
let currentCourse = 'webdev';
let currentGroup = 'group1';

// Course data with proper names and sessions
const courseData = {
    'webdev': {
        name: 'Web Applications Development',
        sessions: [
            { id: 1, date: '2025-01-15', time: '10:00 AM' },
            { id: 2, date: '2025-01-22', time: '10:00 AM' },
            { id: 3, date: '2025-01-29', time: '10:00 AM' },
            { id: 4, date: '2025-02-05', time: '10:00 AM' },
            { id: 5, date: '2025-02-12', time: '10:00 AM' },
            { id: 6, date: '2025-02-19', time: '10:00 AM' }
        ]
    },
    'database': {
        name: 'Database Management Systems',
        sessions: [
            { id: 1, date: '2025-01-16', time: '02:00 PM' },
            { id: 2, date: '2025-01-23', time: '02:00 PM' },
            { id: 3, date: '2025-01-30', time: '02:00 PM' },
            { id: 4, date: '2025-02-06', time: '02:00 PM' },
            { id: 5, date: '2025-02-13', time: '02:00 PM' },
            { id: 6, date: '2025-02-20', time: '02:00 PM' }
        ]
    },
    'network': {
        name: 'Computer Networks & Security',
        sessions: [
            { id: 1, date: '2025-01-17', time: '09:00 AM' },
            { id: 2, date: '2025-01-24', time: '09:00 AM' },
            { id: 3, date: '2025-01-31', time: '09:00 AM' },
            { id: 4, date: '2025-02-07', time: '09:00 AM' },
            { id: 5, date: '2025-02-14', time: '09:00 AM' },
            { id: 6, date: '2025-02-21', time: '09:00 AM' }
        ]
    }
};

// Course session data for session page
const courseSessions = {
    'webdev': {
        name: 'Web Applications Development',
        sessions: [
            { id: 1, date: '2025-01-15', time: '10:00 AM' },
            { id: 2, date: '2025-01-22', time: '10:00 AM' },
            { id: 3, date: '2025-01-29', time: '10:00 AM' },
            { id: 4, date: '2025-02-05', time: '10:00 AM' },
            { id: 5, date: '2025-02-12', time: '10:00 AM' },
            { id: 6, date: '2025-02-19', time: '10:00 AM' }
        ]
    },
    'database': {
        name: 'Database Management Systems', 
        sessions: [
            { id: 1, date: '2025-01-16', time: '02:00 PM' },
            { id: 2, date: '2025-01-23', time: '02:00 PM' },
            { id: 3, date: '2025-01-30', time: '02:00 PM' },
            { id: 4, date: '2025-02-06', time: '02:00 PM' },
            { id: 5, date: '2025-02-13', time: '02:00 PM' },
            { id: 6, date: '2025-02-20', time: '02:00 PM' }
        ]
    },
    'network': {
        name: 'Computer Networks & Security',
        sessions: [
            { id: 1, date: '2025-01-17', time: '09:00 AM' },
            { id: 2, date: '2025-01-24', time: '09:00 AM' },
            { id: 3, date: '2025-01-31', time: '09:00 AM' },
            { id: 4, date: '2025-02-07', time: '09:00 AM' },
            { id: 5, date: '2025-02-14', time: '09:00 AM' },
            { id: 6, date: '2025-02-21', time: '09:00 AM' }
        ]
    }
};

// ===================== UTILITY FUNCTIONS =====================
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
    });
}

function getDBCourseCode(course) {
    const courseMap = {
        'webdev': 'WEB101',
        'database': 'DB101',
        'network': 'NET101'
    };
    return courseMap[course] || 'WEB101';
}

function getStatusMessage(presentCount) {
    if (presentCount === 6) return 'Excellent 🌟';
    if (presentCount >= 4) return 'Good ✅';
    if (presentCount >= 3) return 'Warning ⚠️';
    return 'Critical 🚨';
}

function calculateParticipation(sessions) {
    if (sessions.length === 0) return 0;
    const total = sessions.reduce((sum, session) => sum + (session.participation || 0), 0);
    return Math.round(total / sessions.length);
}

// ===================== ADD STUDENT PAGE FUNCTIONS =====================

function addStudent() {
    // Get form values - only basic fields
   function addStudent() {
    const studentData = {
        id: document.getElementById('studentId').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        firstName: document.getElementById('firstName').value.trim(),
        course: document.getElementById('course').value,  // Should be 'webdev' or 'database'
        group: document.getElementById('group').value     // Should be 'group1' or 'group2'
    };

    console.log('Sending student data:', studentData); // Add this to debug

    // Rest of your code...
}

    // Basic validation
    if (!studentData.id || !studentData.lastName || !studentData.firstName || !studentData.course || !studentData.group) {
        alert('Please fill all required fields');
        return;
    }

    // Send to PHP
    fetch('../db/add_student.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(studentData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('✅ Student added successfully!');
            clearForm();
        } else {
            alert('❌ Error: ' + data.error);
        }
    })
    .catch(error => {
        alert('❌ Network error: ' + error.message);
    });
}


function clearForm() {
    document.getElementById('addStudentForm').reset();
}

// ===================== ATTENDANCE MARKING PAGE FUNCTIONS =====================
function loadStudents(course, group, sessionId) {
    console.log('Loading students for:', course, group, sessionId);
    
    // Show loading
    document.getElementById('studentsTableBody').innerHTML = 
        '<tr><td colspan="5" style="text-align: center; padding: 20px;">🔄 Loading students...</td></tr>';

    // Use the correct path to your PHP file
    fetch(`./db/get_students.php?course=${course}&group=${group}`)
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(students => {
            console.log('Students received:', students);
            
            if (students && Array.isArray(students) && students.length > 0) {
                displayStudents(students);
            } else {
                console.log('No students found, using fallback');
                useFallbackStudents();
            }
        })
        .catch(error => {
            console.error('Error loading students:', error);
            useFallbackStudents();
        });
}


function useFallbackStudents() {
    console.log('Using fallback student data');
    const fallbackStudents = [
        { id: '2023001', last_name: 'Ben Ahmed', first_name: 'Ali' },
        { id: '2023002', last_name: 'Toumi', first_name: 'Sarah' },
        { id: '2023003', last_name: 'Youcef', first_name: 'Hiba' },
        { id: '2023004', last_name: 'Benzerga', first_name: 'Mohamed' },
        { id: '2023005', last_name: 'Boudiaf', first_name: 'Fatima' }
    ];
    displayStudents(fallbackStudents);
}

function displayStudents(students) {
    const tbody = document.getElementById('studentsTableBody');
    tbody.innerHTML = '';

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.last_name} ${student.first_name}</td>
            <td class="present-cell clickable" data-status="empty"></td>
            <td class="participation-cell clickable" data-participation="empty"></td>
            <td><button class="view-btn" onclick="viewJustification('${student.id}')">View</button></td>
        `;
        tbody.appendChild(row);
    });

    // Add click functionality
    addClickHandlers();
}

function addClickHandlers() {
    // Present cell click - cycles through options
    document.querySelectorAll('.present-cell.clickable').forEach(cell => {
        cell.addEventListener('click', function() {
            const currentStatus = this.getAttribute('data-status');
            let newStatus, newSymbol;
            
            if (currentStatus === 'empty') {
                newStatus = 'present';
                newSymbol = '✅';
            } else if (currentStatus === 'present') {
                newStatus = 'absent';
                newSymbol = '❌';
            } else if (currentStatus === 'absent') {
                newStatus = 'late';
                newSymbol = '⏰';
            } else {
                newStatus = 'empty';
                newSymbol = '';
            }
            
            this.setAttribute('data-status', newStatus);
            this.textContent = newSymbol;
            
            // Add color coding
            this.style.backgroundColor = newStatus === 'present' ? '#d4ffd4' : 
                                       newStatus === 'absent' ? '#ffd4d4' : '#fff9d4';
        });
    });

    // Participation cell click - cycles through options
    document.querySelectorAll('.participation-cell.clickable').forEach(cell => {
        cell.addEventListener('click', function() {
            const currentLevel = this.getAttribute('data-participation');
            let newLevel, newSymbol;
            
            if (currentLevel === 'empty') {
                newLevel = 'active';
                newSymbol = '⭐';
            } else if (currentLevel === 'active') {
                newLevel = 'average';
                newSymbol = '🔶';
            } else if (currentLevel === 'average') {
                newLevel = 'minimal';
                newSymbol = '🔻';
            } else {
                newLevel = 'empty';
                newSymbol = '';
            }
            
            this.setAttribute('data-participation', newLevel);
            this.textContent = newSymbol;
            
            // Add color coding
            this.style.backgroundColor = newLevel === 'active' ? '#e6f7ff' : 
                                       newLevel === 'average' ? '#fff9e6' : '#ffe6e6';
        });
    });
}

function viewJustification(studentId) {
    alert(`View justification for student ${studentId}`);
}

function updateHeader(courseName, sessionId, sessionDate, group) {
    const formattedDate = formatDate(sessionDate);
    
    document.getElementById('moduleName').textContent = courseName;
    document.getElementById('sessionInfo').textContent = 
        `Session ${sessionId} | Date: ${formattedDate} | Group: ${group}`;
}

function saveAttendance() {
    const sessionData = JSON.parse(sessionStorage.getItem('currentSession') || '{}');
    
    const course = sessionData.courseId || 'webdev';
    const group = sessionData.group || 'Group 01';
    const sessionId = sessionData.sessionId || '1';
    
    // Convert course code to database format
    const dbCourse = getDBCourseCode(course);
    const attendanceData = [];
    let hasUnmarkedStudents = false;
    
    document.querySelectorAll('#studentsTableBody tr').forEach(row => {
        const cells = row.cells;
        const studentId = cells[0].textContent;
        const attendanceStatus = cells[2].getAttribute('data-status') || 'empty';
        const participationLevel = cells[3].getAttribute('data-participation') || 'empty';
        
        // Check if attendance is marked
        if (attendanceStatus === 'empty') {
            hasUnmarkedStudents = true;
            cells[2].style.backgroundColor = '#ffcccc';
            cells[2].style.animation = 'blink 1s infinite';
            return;
        }
        
        // Convert participation level to percentage
        let participationPercent = 0;
        if (participationLevel === 'active') participationPercent = 100;
        else if (participationLevel === 'average') participationPercent = 60;
        else if (participationLevel === 'minimal') participationPercent = 20;
        
        // FORMAT DATA TO MATCH YOUR PHP EXACTLY
        attendanceData.push({
            student_id: studentId,
            session: sessionId,  // This becomes session_id in database
            status: attendanceStatus,
            participation: participationPercent
        });
    });
    
    if (hasUnmarkedStudents) {
        alert('❌ Please mark attendance for all students before saving!');
        return;
    }
    
    if (attendanceData.length === 0) {
        alert('❌ No attendance data to save!');
        return;
    }
    
    console.log('Sending to PHP:', {
        course: dbCourse,
        attendance: attendanceData
    });
    
    // DEBUG VERSION - See exactly what's happening
    fetch('../db/save_attendance.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            course: dbCourse,
            attendance: attendanceData
        })
    })
    .then(response => {
        console.log('Response status:', response.status);
        return response.text().then(text => {
            console.log('Raw response from PHP:', text);
            try {
                return JSON.parse(text);
            } catch (e) {
                console.error('JSON parse error:', e);
                throw new Error('PHP returned invalid JSON: ' + text.substring(0, 100));
            }
        });
    })
    .then(data => {
        console.log('Parsed response data:', data);
        if (data.success) {
            alert('✅ Attendance saved successfully for ' + data.count + ' students!');
        } else {
            alert('❌ Error: ' + (data.error || data.message || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Full error details:', error);
        alert('❌ Save failed: ' + error.message);
    });
}

// ===================== ATTENDANCE LIST PAGE FUNCTIONS =====================
function loadAttendanceData() {
    const course = document.getElementById('courseSelect').value;
    const group = document.getElementById('groupSelect').value;
    
    console.log('Loading students for: ' + course + ' - ' + group);
    
    // Show loading message
    document.querySelector('#attendanceTable tbody').innerHTML = 
        '<tr><td colspan="20" style="text-align:center; padding:20px;">🔄 Loading students from database...</td></tr>';
    
    // First, let's test if we can find any PHP file to determine the correct base path
    testBasePath(course, group);
}

function testBasePath(course, group) {
    const testPaths = [
        'get_students.php',
        './get_students.php',
        '../get_students.php',
        '../../get_students.php',
        'db/get_students.php',
        './db/get_students.php',
        '../db/get_students.php',
        '../../db/get_students.php',
        '/db/get_students.php',
        'attendance/get_students.php',
        '../attendance/get_students.php'
    ];
    
    tryPaths(testPaths, 0, course, group);
}

function tryPaths(paths, index, course, group) {
    if (index >= paths.length) {
        // All paths failed - show helpful message
        document.querySelector('#attendanceTable tbody').innerHTML = 
            '<tr><td colspan="20" style="text-align:center; padding:20px; color:red;">' +
            '❌ Cannot connect to database. Please check:<br>' +
            '1. PHP file exists in correct location<br>' +
            '2. Database is running<br>' +
            '3. File permissions are correct<br><br>' +
            '<button onclick="showDemoData()" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">' +
            'Show Demo Data Instead</button>' +
            '</td></tr>';
        return;
    }
    
    const path = paths[index];
    const url = path + '?course=' + encodeURIComponent(course) + '&group=' + encodeURIComponent(group) + '&t=' + Date.now();
    
    console.log('Trying path [' + index + ']: ' + path);
    
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.text().then(text => {
                    console.log('✅ SUCCESS with path: ' + path);
                    console.log('Raw response:', text);
                    
                    try {
                        // Remove PHP comments and parse JSON
                        const jsonText = text.replace(/\/\*.*?\*\//g, '').trim();
                        const students = JSON.parse(jsonText);
                        
                        if (students && Array.isArray(students)) {
                            displayStudentsTable(students);
                        } else {
                            throw new Error('Invalid data format');
                        }
                    } catch (parseError) {
                        console.error('JSON parse error:', parseError);
                        throw new Error('Invalid JSON response');
                    }
                });
            } else {
                throw new Error('HTTP ' + response.status);
            }
        })
        .catch(error => {
            console.log('❌ Path failed: ' + path + ' - ' + error.message);
            // Try next path
            setTimeout(() => {
                tryPaths(paths, index + 1, course, group);
            }, 100);
        });
}

function displayStudentsTable(students) {
    const tbody = document.querySelector('#attendanceTable tbody');
    tbody.innerHTML = '';
    
    if (!Array.isArray(students) || students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="20" style="text-align:center; padding:20px; color:#666;">No students found in database for this course/group</td></tr>';
        return;
    }
    
    const course = document.getElementById('courseSelect').value;
    const studentIds = students.map(student => student.id);
    
    // Load saved attendance first
    fetch('../db/get_saved_attendance.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            course: course,
            student_ids: studentIds
        })
    })
    .then(response => response.json())
    .then(savedAttendance => {
        // Now render students with their saved attendance
        renderStudentsTable(students, savedAttendance);
    })
    .catch(error => {
        console.log('No saved attendance found');
        renderStudentsTable(students, []);
    });
}

function renderStudentsTable(students, savedAttendance) {
    const tbody = document.querySelector('#attendanceTable tbody');
    tbody.innerHTML = '';
    
    students.forEach(student => {
        const row = document.createElement('tr');
        
        // Generate session cells with saved data
        let sessionCells = '';
        for (let i = 1; i <= 6; i++) {
            // Find saved attendance for this student and session
            const savedSession = savedAttendance.find(s => 
                s.student_id === student.id && s.session_id === i
            );
            
            const presentStatus = savedSession ? savedSession.status : 'empty';
            const presentSymbol = presentStatus === 'present' ? '✅' : '';
            const presentColor = presentStatus === 'present' ? '#d4ffd4' : '';
            
            const participationStatus = (savedSession && savedSession.participation === 100) ? 'participation' : 'empty';
            const participationSymbol = participationStatus === 'participation' ? '⭐' : '';
            const participationColor = participationStatus === 'participation' ? '#e6f7ff' : '';
            
            sessionCells += `
                <td class="present-cell clickable" data-student="${student.id}" data-session="${i}" data-status="${presentStatus}" style="background-color: ${presentColor}">${presentSymbol}</td>
                <td class="absent-cell clickable" data-student="${student.id}" data-session="${i}" data-status="${participationStatus}" style="background-color: ${participationColor}">${participationSymbol}</td>
            `;
        }
        
        // Calculate absence count from saved data
        const studentSessions = savedAttendance.filter(s => s.student_id === student.id);
        const presentCount = studentSessions.filter(s => s.status === 'present').length;
        const absenceCount = 6 - presentCount;
        
        row.innerHTML = `
            <td><strong>${student.id}</strong></td>
            <td><strong>${student.last_name}</strong></td>
            <td><strong>${student.first_name}</strong></td>
            ${sessionCells}
            <td class="participation-cell">${calculateParticipation(studentSessions)}%</td>
            <td class="absence-count" data-student="${student.id}">${absenceCount}</td>
            <td class="message-cell" data-student="${student.id}">${getStatusMessage(presentCount)}</td>
            <td><button class="delete-btn" onclick="deleteStudent('${student.id}')">🗑️</button></td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Add click handlers after creating the table
    addTableClickHandlers();
    
    console.log('✅ Loaded ' + students.length + ' students with saved attendance');
}

function addTableClickHandlers() {
    // Present cell click - cycles through options
    document.querySelectorAll('.present-cell.clickable').forEach(cell => {
        cell.addEventListener('click', function() {
            const currentStatus = this.getAttribute('data-status');
            const studentId = this.getAttribute('data-student');
            const session = this.getAttribute('data-session');
            
            let newStatus, newSymbol;
            
            if (currentStatus === 'empty') {
                newStatus = 'present';
                newSymbol = '✅';
            } else if (currentStatus === 'present') {
                newStatus = 'absent';
                newSymbol = '❌';
            } else {
                newStatus = 'empty';
                newSymbol = '';
            }
            
            this.setAttribute('data-status', newStatus);
            this.textContent = newSymbol;
            
            // Add color coding
            this.style.backgroundColor = newStatus === 'present' ? '#d4ffd4' : 
                                       newStatus === 'absent' ? '#ffd4d4' : '';
            
            // Update absence count and message
            updateStudentStats(studentId);
            
            console.log(`Student ${studentId}, Session ${session}: ${newStatus}`);
        });
    });

    // Absent cell click - simple toggle
    document.querySelectorAll('.absent-cell.clickable').forEach(cell => {
        cell.addEventListener('click', function() {
            const currentStatus = this.getAttribute('data-status');
            const studentId = this.getAttribute('data-student');
            const session = this.getAttribute('data-session');
            
            let newStatus, newSymbol;
            
            if (currentStatus === 'empty') {
                newStatus = 'participation';
                newSymbol = '✅';
            } else {
                newStatus = 'empty';
                newSymbol = '';
            }
            
            this.setAttribute('data-status', newStatus);
            this.textContent = newSymbol;
            
            // Add color coding
            this.style.backgroundColor = newStatus === 'participation' ? '#d4ffd4' : '';
            
            // Update absence count and message
            updateStudentStats(studentId);
            
            console.log(`Student ${studentId}, Session ${session}: ${newStatus}`);
        });
    });
}

function updateStudentStats(studentId) {
    const studentRow = document.querySelector(`[data-student="${studentId}"]`).closest('tr');
    let presentCount = 0;
    
    // Count present sessions (both regular present and participation)
    for (let session = 1; session <= 6; session++) {
        const presentCell = studentRow.querySelector(`.present-cell[data-session="${session}"]`);
        const absentCell = studentRow.querySelector(`.absent-cell[data-session="${session}"]`);
        
        if ((presentCell && presentCell.getAttribute('data-status') === 'present') ||
            (absentCell && absentCell.getAttribute('data-status') === 'participation')) {
            presentCount++;
        }
    }
    
    const absenceCount = 6 - presentCount;
    
    // Update absence count
    const absenceCountCell = studentRow.querySelector('.absence-count');
    absenceCountCell.textContent = absenceCount;
    
    // Update message
    const messageCell = studentRow.querySelector('.message-cell');
    messageCell.textContent = getStatusMessage(presentCount);
}

function showDemoData() {
    const demoStudents = [
        {id: '2023001', last_name: 'Ben Ahmed', first_name: 'Ali'},
        {id: '2023002', last_name: 'Toumi', first_name: 'Sarah'},
        {id: '2023003', last_name: 'Youcef', first_name: 'Hiba'},
        {id: '2023004', last_name: 'Benzerga', first_name: 'Mohamed'},
        {id: '2023005', last_name: 'Boudiaf', first_name: 'Fatima'}
    ];
    
    displayStudentsTable(demoStudents);
    console.log('📋 Showing demo data');
}

function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete student ' + studentId + '?')) {
        console.log('Deleting student:', studentId);
        // Add your delete logic here
        alert('Student ' + studentId + ' would be deleted (delete function not implemented)');
    }
}

function updateAttendance() {
    const course = document.getElementById('courseSelect').value;
    const group = document.getElementById('groupSelect').value;
    const attendanceData = [];
    
    // Collect all attendance data from the table
    document.querySelectorAll('#attendanceTable tbody tr').forEach(row => {
        const studentId = row.cells[0].textContent.trim();
        
        // Process each session (S1 to S6)
        for (let session = 1; session <= 6; session++) {
            const presentCell = row.querySelector(`.present-cell[data-session="${session}"]`);
            const participationCell = row.querySelector(`.participation-cell[data-session="${session}"]`);
            
            let status = 'absent';
            let participation = 0;
            
            // Check present cell
            if (presentCell && presentCell.getAttribute('data-status') === 'present') {
                status = 'present';
                participation = 80;
            }
            // Check participation cell
            else if (participationCell && participationCell.getAttribute('data-status') === 'participation') {
                status = 'present';
                participation = 100;
            }
            
            // Save all records (including absent to clear previous data)
            attendanceData.push({
                student_id: studentId,
                session: session,
                status: status,
                participation: participation
            });
        }
    });
    
    if (attendanceData.length === 0) {
        alert('❌ No attendance data to save! Please mark some students first.');
        return;
    }
    
    console.log('Saving to database:', attendanceData);
    
    // Show saving state
    const processBtn = document.getElementById('processBtn');
    const originalText = processBtn.textContent;
    processBtn.textContent = '🔄 Saving...';
    processBtn.disabled = true;
    
    // Save to database
    fetch('../db/save_attendance.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            course: course,
            attendance: attendanceData
        })
    })
    .then(response => {
        console.log('Response status:', response.status);
        return response.text().then(text => {
            console.log('Raw response:', text);
            try {
                return JSON.parse(text);
            } catch (e) {
                console.error('JSON parse error:', e);
                throw new Error('Invalid JSON response: ' + text.substring(0, 100));
            }
        });
    })
    .then(data => {
        console.log('Parsed response:', data);
        if (data.success) {
            alert(`✅ Attendance saved successfully for ${attendanceData.length} records!`);
            // UPDATE: Calculate and display statistics after saving
            calculateAttendanceStats();
        } else {
            alert('❌ Error: ' + (data.error || data.message || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Full error:', error);
        alert('❌ Network error: ' + error.message);
    })
    .finally(() => {
        processBtn.textContent = originalText;
        processBtn.disabled = false;
    });
}

// ADD THIS FUNCTION: Calculate and display attendance statistics
function calculateAttendanceStats() {
    const rows = document.querySelectorAll('#attendanceTable tbody tr');
    
    rows.forEach(row => {
        const cells = row.cells;
        let presentCount = 0;
        let participationTotal = 0;
        let sessionCount = 6; // Fixed to 6 sessions

        // Count present sessions and participation
        for (let session = 1; session <= 6; session++) {
            const presentCell = row.querySelector(`.present-cell[data-session="${session}"]`);
            const participationCell = row.querySelector(`.participation-cell[data-session="${session}"]`);
            
            if (presentCell && presentCell.getAttribute('data-status') === 'present') {
                presentCount++;
                participationTotal += 80; // Base participation for present
            }
            
            // Bonus for active participation
            if (participationCell && participationCell.getAttribute('data-status') === 'participation') {
                participationTotal += 20; // Extra 20% for active participation
                // If they're marked as participation but not present, count as present
                if (!presentCell || presentCell.getAttribute('data-status') !== 'present') {
                    presentCount++;
                }
            }
        }

        const absenceCount = 6 - presentCount;
        const participationPercent = Math.round(participationTotal / 6);

        // Update the table cells - adjust indexes based on your actual table structure
        // Assuming: ID, Last Name, First Name, [S1-A, S1-P, S2-A, S2-P, ... S6-A, S6-P], Participation, Absence, Message, Delete
        const participationCell = cells[cells.length - 4]; // Participation column
        const absenceCell = cells[cells.length - 3]; // Absence column  
        const messageCell = cells[cells.length - 2]; // Message column

        if (participationCell) participationCell.textContent = participationPercent + '%';
        if (absenceCell) absenceCell.textContent = absenceCount;
        if (messageCell) messageCell.textContent = getStatusMessage(presentCount);

        // Color coding based on attendance
        if (absenceCount < 3) {
            row.style.backgroundColor = '#b3ffb3'; // Green for good attendance
        } else if (absenceCount <= 4) {
            row.style.backgroundColor = '#ffff99'; // Yellow for warning
        } else {
            row.style.backgroundColor = '#ff9999'; // Red for critical
        }
    });
}

// ADD THIS FUNCTION: Get status message based on attendance
function getStatusMessage(presentCount) {
    if (presentCount === 6) return 'Excellent 🌟';
    if (presentCount >= 4) return 'Good ✅';
    if (presentCount >= 3) return 'Warning ⚠️';
    return 'Critical 🚨';
  }

// UPDATE YOUR EVENT LISTENER
if (processBtn) {
    processBtn.addEventListener('click', function() {
        updateAttendance(); // This will now save AND calculate stats
    });
}

function highlightExcellent() {
    const rows = document.querySelectorAll('#attendanceTable tbody tr');
    let highlighted = 0;
    
    rows.forEach(row => {
        const messageCell = row.querySelector('.message-cell');
        if (messageCell && messageCell.textContent.includes('Excellent')) {
            row.style.outline='3px solid #00b3b3';
            row.style.backgroundColor='#b3ffb3';
        }
    });
}

function resetColors() {
    const rows = document.querySelectorAll('#attendanceTable tbody tr');
    rows.forEach(row => {
        row.style.backgroundColor = '';
    });
    alert('🎨 Colors reset!');
}

// ===================== SESSION PAGE FUNCTIONS =====================
function viewSessions(courseId, group) {
    // Store course info for the sessions page
    sessionStorage.setItem('currentCourse', JSON.stringify({
        courseId: courseId,
        group: group
    }));
    
    // Redirect to sessions page
    window.location.href = 'session.html';
}

function markAttendance(sessionId, sessionDate, courseId, group, courseName) {
    // Store session data for the attendance page
    sessionStorage.setItem('currentSession', JSON.stringify({
        sessionId: sessionId,
        sessionDate: sessionDate,
        courseId: courseId,
        group: group,
        courseName: courseName
    }));
    
    // Redirect to attend_mark.html
    window.location.href = 'attend_mark.html';
}

// ===================== REPORTS PAGE FUNCTIONS =====================

function updateReport() {
    const course = document.getElementById('courseSelect')?.value || 'WEB101';
    const group = document.getElementById('groupSelect')?.value || 'group1';
    
    console.log('🚀 Getting report from PHP for:', course, group);
    
    // Show loading
    document.getElementById('totalStudents').textContent = '...';
    document.getElementById('studentsPresent').textContent = '...';
    document.getElementById('studentsParticipated').textContent = '...';
    document.getElementById('studentsExcluded').textContent = '...';
    
    // Single call to report.php - it does all the database work
    fetch(`../db/report.php?course=${course}&group=${group}`)
        .then(response => response.json())
        .then(data => {
            console.log('📊 Report data received:', data);
            
            // Update the page with data from database
            document.getElementById('totalStudents').textContent = data.totalStudents;
            document.getElementById('studentsPresent').textContent = data.studentsPresent;
            document.getElementById('studentsParticipated').textContent = data.studentsParticipated;
            document.getElementById('studentsExcluded').textContent = data.studentsExcluded;
            
            // Draw chart
            drawReportChart(data.totalStudents, data.studentsPresent, data.studentsParticipated, data.studentsExcluded);
        })
        .catch(error => {
            console.error('Error:', error);
            resetReportToZero();
        });
}

function resetReportToZero() {
    document.getElementById('totalStudents').textContent = '0';
    document.getElementById('studentsPresent').textContent = '0';
    document.getElementById('studentsParticipated').textContent = '0';
    document.getElementById('studentsExcluded').textContent = '0';
    drawReportChart(0, 0, 0, 0);
}

function drawReportChart(total, present, participated, excluded) {
    const canvas = document.getElementById('reportChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy old chart if exists
    if (window.reportChart && typeof window.reportChart.destroy === 'function') {
        window.reportChart.destroy();
    }
    
    // Create new chart
    window.reportChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total Students', 'Present', 'Participated', 'Excluded'],
            datasets: [{
                label: 'Attendance Statistics',
                data: [total, present, participated, excluded],
                backgroundColor: ['#D75858', '#51BBCC', '#b3ffb3', '#ff9999'],
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


// ===================== PAGE INITIALIZATION =====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing page specific functions');

    // Add Student Page
    const addForm = document.getElementById('addStudentForm');
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addStudent();
        });
    }

    // Attendance Marking Page
    const saveAttendanceBtn = document.getElementById('saveAttendance');
    if (saveAttendanceBtn) {
        saveAttendanceBtn.addEventListener('click', saveAttendance);
    }

    // Load dynamic data for attendance marking page
    if (window.location.pathname.includes('attend_mark.html')) {
        const sessionData = JSON.parse(sessionStorage.getItem('currentSession') || '{}');
        
        let course, group, sessionId, sessionDate, courseName;

        if (sessionData.courseId) {
            // Data from sessionStorage
            course = sessionData.courseId;
            group = sessionData.group;
            sessionId = sessionData.sessionId;
            sessionDate = sessionData.sessionDate;
            courseName = sessionData.courseName;
        } else {
            // Fallback to URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            course = urlParams.get('course') || 'webdev';
            group = urlParams.get('group') || 'Group 01';
            sessionId = urlParams.get('session') || '1';
            sessionDate = urlParams.get('date') || '2025-01-15';
            courseName = courseData[course]?.name || 'Web Applications Development';
        }

        // Update header dynamically
        updateHeader(courseName, sessionId, sessionDate, group);
        
        // Load students for this course/group
        loadStudents(course, group, sessionId);
    }

    // Session Page Initialization
    if (window.location.pathname.includes('session.html')) {
        // Get course data from sessionStorage (set from home page)
        const courseData = JSON.parse(sessionStorage.getItem('currentCourse'));
        
        if (courseData && courseSessions[courseData.courseId]) {
            const courseInfo = courseSessions[courseData.courseId];
            
            // Update module name in header
            const moduleHeader = document.querySelector('.session-header h1');
            if (moduleHeader) {
                moduleHeader.textContent = `Module: ${courseInfo.name}`;
            }

            // Update sessions list
            const sessionsList = document.querySelector('.sessions-list');
            if (sessionsList) {
                sessionsList.innerHTML = courseInfo.sessions.map(session => `
                    <div class="session-card">
                        <h1>Session ${session.id}</h1>
                        <p>Date: ${formatDate(session.date)}</p>
                        <p>${session.time}</p>
                        <button onclick="markAttendance(${session.id}, '${session.date}', '${courseData.courseId}', '${courseData.group}', '${courseInfo.name}')">
                            Mark Attendance
                        </button>
                    </div>
                `).join('');
            }
        } else {
            // If no course data, redirect to home
            window.location.href = 'home.html';
        }
    }

    // Attendance List Page
    const loadBtn = document.getElementById('loadStudentsBtn');
    if (loadBtn) {
        loadBtn.addEventListener('click', loadAttendanceData);
        console.log('✅ Load Students button ready');
    }
    
    // Setup other buttons for attendance list
    const processBtn = document.getElementById('processBtn');
    if (processBtn) {
        processBtn.addEventListener('click', updateAttendance);
    }
    
    const highlightExcellentBtn = document.getElementById('highlightExcellent');
    if (highlightExcellentBtn) {
        highlightExcellentBtn.addEventListener('click', highlightExcellent);
    }
    
    const resetColorsBtn = document.getElementById('resetColors');
    if (resetColorsBtn) {
        resetColorsBtn.addEventListener('click', resetColors);
    }
    
    // Start message for attendance list
    const tableBody = document.querySelector('#attendanceTable tbody');
    if (tableBody && window.location.pathname.includes('attendance.html')) {
        tableBody.innerHTML = 
            '<tr><td colspan="20" style="text-align:center; padding:20px; color:#666;">👆 Click "Load Students" to load from database</td></tr>';
    }

    // Reports Page
    if (window.location.pathname.includes('reports.html')) {
        console.log('Reports page loaded');
        
        // Try to load and display report data immediately
        updateReport();
        
        // If no data in localStorage, use demo data
        const students = JSON.parse(localStorage.getItem('students')) || [];
        if (students.length === 0) {
            console.log('No students found in localStorage, using demo data');
            // You can add demo data here if needed, or leave it empty
        }
    }

    // Add blinking animation for errors
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
        }
        
        .clickable {
            cursor: pointer;
            transition: background-color 0.2s ease;
            text-align: center;
            font-weight: bold;
            min-width: 40px;
            height: 40px;
        }
        
        .clickable:hover {
            opacity: 0.8;
            transform: scale(1.05);
        }
        
        .present-cell, .absent-cell, .participation-cell {
            border-radius: 4px;
            margin: 2px;
        }
        
        .message-cell {
            font-weight: bold;
            text-align: center;
        }
        
        .absence-count {
            font-weight: bold;
            text-align: center;
            color: #dc3545;
        }
    `;
    document.head.appendChild(style);
});

// Make functions globally available
window.addStudent = addStudent;
window.clearForm = clearForm;
window.viewSessions = viewSessions;
window.markAttendance = markAttendance;
window.loadAttendanceData = loadAttendanceData;
window.showDemoData = showDemoData;
window.deleteStudent = deleteStudent;
window.updateAttendance = updateAttendance;
window.highlightExcellent = highlightExcellent;
window.resetColors = resetColors;
window.updateReport = updateReport;

// Add this function to help debug - call it in browser console
window.debugPaths = function() {
    const testUrl = 'get_students.php?course=WEB101&group=Group 01';
    console.log('Testing basic path:', testUrl);
    
    fetch(testUrl)
        .then(r => console.log('Basic test:', r.status, r.statusText))
        .catch(e => console.log('Basic test error:', e.message));
};












function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete student ' + studentId + '?')) {
        console.log('Deleting student:', studentId);
        
        const course = document.getElementById('courseSelect').value;
        const group = document.getElementById('groupSelect').value;
        
        // Delete from database
        fetch('../db/delete_student.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                id: studentId,
                course: course,
                group: group 
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Remove from table
                const rows = document.querySelectorAll('#attendanceTable tbody tr');
                rows.forEach(row => {
                    if (row.cells[0].textContent.trim() === studentId) {
                        row.remove();
                    }
                });
                alert('✅ Student deleted successfully!');
            } else {
                alert('❌ Error: ' + data.message);
            }
        })
        .catch(err => {
            console.error('Delete student error:', err);
            alert('❌ Network error: ' + err.message);
        });
    }
}