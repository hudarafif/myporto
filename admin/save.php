<?php
$projectsJson = '../data/projects.json';
$targetDir = "../dist/img/portfolio/";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $projects = [];
    if (file_exists($projectsJson)) {
        $projects = json_decode(file_get_contents($projectsJson), true);
    }

    $action = $_POST['action'] ?? '';

    if ($action === 'add') {
        $title = $_POST['title'] ?? '';
        $description = $_POST['description'] ?? '';
        $link = $_POST['link'] ?? '';
        
        // Handle Image Upload
        if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
            $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
            // Renaming strategy: title_slug_timestamp.ext
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
            $filename = $slug . "_" . time() . "." . $ext;
            $targetPath = $targetDir . $filename;

            if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
                $newProject = [
                    "id" => time(), // Simple unique ID
                    "title" => $title,
                    "description" => $description,
                    "image" => "dist/img/portfolio/" . $filename,
                    "link" => $link
                ];
                $projects[] = $newProject;
                file_put_contents($projectsJson, json_encode($projects, JSON_PRETTY_PRINT));
            }
        }
    } 
    
    elseif ($action === 'update') {
        $id = $_POST['id'] ?? '';
        $title = $_POST['title'] ?? '';
        $description = $_POST['description'] ?? '';
        $link = $_POST['link'] ?? '';

        foreach ($projects as &$project) {
            if ((string)($project['id'] ?? '') !== (string)$id) {
                continue;
            }

            $project['title'] = $title;
            $project['description'] = $description;
            $project['link'] = $link;

            // Replace image only if a new file is uploaded
            if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
                $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
                $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
                $filename = $slug . "_" . time() . "." . $ext;
                $targetPath = $targetDir . $filename;

                if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
                    // Delete old image file if exists
                    if (!empty($project['image'])) {
                        $oldFilePath = "../" . $project['image'];
                        if (file_exists($oldFilePath)) {
                            unlink($oldFilePath);
                        }
                    }
                    $project['image'] = "dist/img/portfolio/" . $filename;
                }
            }

            break;
        }
        unset($project);
        file_put_contents($projectsJson, json_encode($projects, JSON_PRETTY_PRINT));
    }
    
    elseif ($action === 'delete') {
        $id = $_POST['id'] ?? '';
        $filteredProjects = [];
        foreach ($projects as $project) {
            if ($project['id'] == $id) {
                // Delete actual file
                $filePath = "../" . $project['image'];
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
                continue;
            }
            $filteredProjects[] = $project;
        }
        file_put_contents($projectsJson, json_encode($filteredProjects, JSON_PRETTY_PRINT));
    }

    header("Location: index.php");
    exit();
}
