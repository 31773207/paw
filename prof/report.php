<?php
// Database configuration
$host = 'localhost';
$dbname = 'attendflow_db';
$username = 'root';
$password = '';

// Get parameters or use defaults
$course = isset($_GET['course']) ? $_GET['course'] : 'WEB101';
$group = isset($_GET['group']) ? $_GET['group'] : 'Group 01';

// Initialize variables
$totalStudents = 0;
$studentsPresent = 0;
$studentsParticipated = 0;
$studentsExcluded = 0;

try {
    // Connect to MySQL database
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // 1. Get students for this course and group
    $sql = "SELECT s.id, s.first_name, s.last_name 
            FROM students s
            JOIN enrollment e ON s.id = e.student_id
            WHERE e.course_id = ? AND e.student_group = ?
            ORDER BY s.last_name, s.first_name";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$course, $group]);
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $totalStudents = count($students);
    
    if (!empty($students)) {
        $studentIds = array_column($students, 'id');
        
        // 2. Get attendance summary for each student
        $placeholders = str_repeat('?,', count($studentIds) - 1) . '?';
        $sql = "SELECT 
                    student_id,
                    COUNT(CASE WHEN status = 'absent' THEN 1 END) as absence_count,
                    AVG(participation) as avg_participation
                FROM mark_attendance 
                WHERE course_id = ? AND group_name = ? AND student_id IN ($placeholders)
                GROUP BY student_id";
        
        $stmt = $pdo->prepare($sql);
        $params = array_merge([$course, $group], $studentIds);
        $stmt->execute($params);
        $attendanceSummary = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // 3. Organize the summary data by student
        $studentSummary = [];
        foreach ($attendanceSummary as $record) {
            $studentSummary[$record['student_id']] = [
                'absence_count' => $record['absence_count'],
                'participation_rate' => $record['avg_participation']
            ];
        }
        
        // 4. Calculate statistics
        foreach ($students as $student) {
            $studentId = $student['id'];
            $summary = $studentSummary[$studentId] ?? ['absence_count' => 0, 'participation_rate' => 0];
            
            $absenceCount = $summary['absence_count'];
            $participationRate = $summary['participation_rate'];
            
            // Apply your logic:
            if ($absenceCount > 3) {
                // Excluded: Students with > 3 absences
                $studentsExcluded++;
            } else {
                // Present: Students with <= 3 absences
                $studentsPresent++;
                
                // Participated: Students with > 40% participation rate
                if ($participationRate > 40) {
                    $studentsParticipated++;
                }
            }
        }
        
    }
    
} catch(PDOException $e) {
    // Keep zeros if there's an error
    $totalStudents = 0;
    $studentsPresent = 0;
    $studentsParticipated = 0;
    $studentsExcluded = 0;
    error_log("Database error: " . $e->getMessage());
}
?>



<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AttendFlow - Reports</title>
<link rel="stylesheet" href="style.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="reports-page" style="background-color:#FFEAEA;">

<nav class="navbar">
  <div class="logo">AttendFlow</div>
  <ul class="nav-links">
    <li><a href="home.html">Home</a></li>
    <li><a href="attendance.html">List</a></li>
    <li><a href="addstudent.html">Add Student</a></li>
    <li><a href="simple_report.php" class="active">Reports</a></li>
    <li><a href="../logout.html" class="logout">Logout</a></li>
  </ul>
</nav>

<h1 class="page-title" style="color: #D75858; font-size: 50px">Attendance Report</h1>
<p style="color: blod#666; font-size: 25px">This page show the overall attendence and participation statistics of the group.</p>

<!-- Course and Group Selection -->
<div class="selection-bar" style="margin: 20px 0; padding: 20px; background: linear-gradient(135deg, #fdc8c8ff, #ffd8d8ff); border-radius: 12px; box-shadow: 0 4px 12px rgba(69, 154, 166, 0.2);">
    <form method="GET" action="">
    <label style="margin-right: 25px; color: white; font-weight: 600; font-size: 16px;">
            📚 Course: 
            <select name="course" style="margin-left: 8px; padding: 8px 12px; border: none; border-radius: 6px; background: white; color: #333; font-size: 14px; cursor: pointer; min-width: 180px;">
                <option value="WEB101" <?php echo ($course == 'WEB101') ? 'selected' : ''; ?>>Web Development</option>
                <option value="DB101" <?php echo ($course == 'DB101') ? 'selected' : ''; ?>>Database Systems</option>
            </select>
        </label>
        
        <label style="margin-right: 25px; color: white; font-weight: 600; font-size: 16px;">
            👥 Group: 
            <select name="group" style="margin-left: 8px; padding: 8px 12px; border: none; border-radius: 6px; background: white; color: #333; font-size: 14px; cursor: pointer; min-width: 180px;">
                <option value="Group 01" <?php echo ($group == 'Group 01') ? 'selected' : ''; ?>>Group 01</option>
                <option value="Group 02" <?php echo ($group == 'Group 02') ? 'selected' : ''; ?>>Group 02</option>
            </select>
        </label>
        
        <button class="view-btn"  style="background-color:#D75858;"type="submit">
            Update Report
        </button>
    </form>
</div>

<!-- Stats Container -->
<div class="stats-container">
    <div class="stats-left">
        <div class="stat-item">
            <h3>Total Students</h3>
            <h1 id="totalStudents"><?php echo $totalStudents; ?></h1>
        </div>
        <div class="stat-item">
            <h3>Present Students</h3>
            <h1 id="studentsPresent"><?php echo $studentsPresent; ?></h1>
        </div>
        <div class="stat-item">
            <h3>Participated</h3>
            <h1 id="studentsParticipated"><?php echo $studentsParticipated; ?></h1>
        </div>
        <div class="stat-item">
            <h3>Excluded</h3>
            <h1 id="studentsExcluded"><?php echo $studentsExcluded; ?></h1>
        </div>
    </div>
    
    <div class="stats-right">
        <canvas id="reportChart"></canvas>
    </div>
</div>

<script>
// Draw chart with PHP data
const total = <?php echo $totalStudents; ?>;
const present = <?php echo $studentsPresent; ?>;
const participated = <?php echo $studentsParticipated; ?>;
const excluded = <?php echo $studentsExcluded; ?>;

const canvas = document.getElementById('reportChart');
if (canvas) {
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total Students', 'Present', 'Participated', 'Excluded'],
            datasets: [{
                label: 'Attendance Statistics',
                data: [total, present, participated, excluded],
                backgroundColor: ['#D75858', '#51BBCC', '#b3ffb3', '#ff9999'],
                borderColor: ['#b34747', '#429ca8', '#99cc99', '#cc7a7a'],
                borderWidth: 2,
                borderRadius: 5,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    display: false 
                },
                title: { 
                    display: true, 
                    text: 'Attendance Report',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#D75858'
                },
                tooltip: {
                    backgroundColor: 'rgba(215, 88, 88, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#D75858',
                    borderWidth: 1
                }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: '#666'
                    },
                    grid: {
                        color: 'rgba(215, 88, 88, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#666'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}
</script>

</body>
</html>