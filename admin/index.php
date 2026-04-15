<?php
$projectsJson = '../data/projects.json';
$projects = [];
if (file_exists($projectsJson)) {
    $projects = json_decode(file_get_contents($projectsJson), true);
}

$editId = $_GET['edit'] ?? null;
$editingProject = null;
if ($editId !== null) {
    foreach ($projects as $project) {
        if ((string)($project['id'] ?? '') === (string)$editId) {
            $editingProject = $project;
            break;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard | MyPorto</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body { background-color: #0f172a; color: #f8fafc; }
        .glass { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); }
    </style>
</head>
<body class="min-h-screen p-6 md:p-12">
    <div class="max-w-6xl mx-auto">
        <header class="flex justify-between items-center mb-12">
            <div>
                <h1 class="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">Project Manager</h1>
                <p class="text-slate-400 mt-2">Manage your portfolio items (Local Admin)</p>
            </div>
            <a href="../index.html" class="flex items-center gap-2 text-slate-400 hover:text-white transition">
                <i class="fas fa-arrow-left"></i> Back to Site
            </a>
        </header>

        <div class="grid lg:grid-cols-3 gap-8">
            <!-- Form Section -->
            <div class="lg:col-span-1">
                <div class="glass p-6 rounded-2xl sticky top-8">
                    <h2 class="text-xl font-semibold mb-6 flex items-center gap-2">
                        <i class="fas <?php echo $editingProject ? 'fa-pen-to-square' : 'fa-plus-circle'; ?> text-purple-500"></i>
                        <?php echo $editingProject ? 'Edit Project' : 'Add New Project'; ?>
                    </h2>
                    <form action="save.php" method="POST" enctype="multipart/form-data" class="space-y-4">
                        <input type="hidden" name="action" value="<?php echo $editingProject ? 'update' : 'add'; ?>">
                        <?php if ($editingProject): ?>
                            <input type="hidden" name="id" value="<?php echo htmlspecialchars($editingProject['id']); ?>">
                        <?php endif; ?>
                        <div>
                            <label class="block text-sm font-medium text-slate-400 mb-1">Project Title</label>
                            <input type="text" name="title" required value="<?php echo htmlspecialchars($editingProject['title'] ?? ''); ?>" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-400 mb-1">Description</label>
                            <textarea name="description" required rows="3" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"><?php echo htmlspecialchars($editingProject['description'] ?? ''); ?></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-400 mb-1">GitHub / Demo Link</label>
                            <input type="url" name="link" required value="<?php echo htmlspecialchars($editingProject['link'] ?? ''); ?>" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-400 mb-1">
                                Project Image <?php echo $editingProject ? '(optional, only if replacing)' : ''; ?>
                            </label>
                            <input id="image-input" type="file" name="image" accept="image/*" <?php echo $editingProject ? '' : 'required'; ?> class="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer">
                            <?php if ($editingProject && !empty($editingProject['image'])): ?>
                                <p class="text-xs text-slate-500 mt-2">Current image:</p>
                                <img id="current-image" src="../<?php echo htmlspecialchars($editingProject['image']); ?>" class="w-full h-28 object-cover rounded-lg border border-slate-700 mt-2">
                            <?php endif; ?>
                            <div id="preview-wrapper" class="mt-3 hidden">
                                <p class="text-xs text-slate-400 mb-2">New image preview:</p>
                                <img id="image-preview" src="" alt="Selected image preview" class="w-full h-28 object-cover rounded-lg border border-slate-700">
                            </div>
                        </div>
                        <div class="flex gap-3">
                            <button type="submit" class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition">
                                <?php echo $editingProject ? 'Update Project' : 'Save Project'; ?>
                            </button>
                            <?php if ($editingProject): ?>
                                <a href="index.php" class="w-full text-center bg-slate-700 text-white font-bold py-3 rounded-lg hover:bg-slate-600 transition">Cancel</a>
                            <?php endif; ?>
                        </div>
                    </form>
                </div>
            </div>

            <!-- List Section -->
            <div class="lg:col-span-2">
                <div class="glass rounded-2xl overflow-hidden">
                    <table class="w-full text-left">
                        <thead class="bg-slate-800/50">
                            <tr>
                                <th class="p-4 text-slate-300 font-semibold">Preview</th>
                                <th class="p-4 text-slate-300 font-semibold">Title</th>
                                <th class="p-4 text-slate-300 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800">
                            <?php foreach (array_reverse($projects) as $project): ?>
                            <tr class="hover:bg-slate-800/30 transition">
                                <td class="p-4">
                                    <img src="../<?php echo $project['image']; ?>" class="w-20 h-12 object-cover rounded shadow-md">
                                </td>
                                <td class="p-4">
                                    <div class="font-medium"><?php echo htmlspecialchars($project['title']); ?></div>
                                    <div class="text-xs text-slate-500 truncate max-w-xs"><?php echo htmlspecialchars($project['description']); ?></div>
                                </td>
                                <td class="p-4 text-right">
                                    <a href="index.php?edit=<?php echo urlencode($project['id']); ?>" class="text-amber-400 hover:text-amber-300 p-2 inline-block" title="Edit project">
                                        <i class="fas fa-pen"></i>
                                    </a>
                                    <form action="save.php" method="POST" onsubmit="return confirm('Delete this project?');" class="inline">
                                        <input type="hidden" name="id" value="<?php echo $project['id']; ?>">
                                        <button type="submit" name="action" value="delete" class="text-red-400 hover:text-red-300 p-2">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </form>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                            <?php if (empty($projects)): ?>
                            <tr>
                                <td colspan="3" class="p-12 text-center text-slate-500 italic">No projects found. Add your first one!</td>
                            </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <footer class="mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
            <p>Remember to <strong>git commit & push</strong> after making changes to deploy to Vercel.</p>
        </footer>
    </div>
</body>
<script>
    const imageInput = document.getElementById('image-input');
    const previewWrapper = document.getElementById('preview-wrapper');
    const imagePreview = document.getElementById('image-preview');

    if (imageInput && previewWrapper && imagePreview) {
        imageInput.addEventListener('change', function (event) {
            const file = event.target.files && event.target.files[0];
            if (!file) {
                previewWrapper.classList.add('hidden');
                imagePreview.src = '';
                return;
            }

            const objectUrl = URL.createObjectURL(file);
            imagePreview.src = objectUrl;
            previewWrapper.classList.remove('hidden');
            imagePreview.onload = () => URL.revokeObjectURL(objectUrl);
        });
    }
</script>
</html>
