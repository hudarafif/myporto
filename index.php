<?php
$projectsPath = __DIR__ . '/data/projects.json';
$projects = [];

if (file_exists($projectsPath)) {
    $decoded = json_decode(file_get_contents($projectsPath), true);
    if (is_array($decoded)) {
        $projects = $decoded;
    }
}

$portfolioCards = '';
if (!empty($projects)) {
    foreach ($projects as $project) {
        $title = htmlspecialchars($project['title'] ?? 'Untitled Project', ENT_QUOTES, 'UTF-8');
        $description = htmlspecialchars($project['description'] ?? '', ENT_QUOTES, 'UTF-8');
        $image = htmlspecialchars($project['image'] ?? '', ENT_QUOTES, 'UTF-8');
        $link = htmlspecialchars($project['link'] ?? '#', ENT_QUOTES, 'UTF-8');
        $category = htmlspecialchars($project['category'] ?? 'Web', ENT_QUOTES, 'UTF-8');

        $portfolioCards .= '
            <div class="project-card rounded-lg shadow-md overflow-hidden bg-white dark:bg-slate-700 max-w-sm mx-auto flex flex-col transform transition duration-300 hover:scale-105 hover:shadow-xl">
              <div class="overflow-hidden">
                <img src="' . $image . '" alt="' . $title . '"
                  class="w-full h-48 object-cover transition duration-300 hover:scale-110"
                  loading="lazy" decoding="async">
              </div>
              <div class="p-4 flex flex-col flex-1">
                <span class="inline-block mb-2 text-xs font-semibold text-purple-600 dark:text-purple-300">' . $category . '</span>
                <h3 class="font-semibold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2">' . $title . '</h3>
                <p class="text-slate-500 text-sm line-clamp-3">' . $description . '</p>
                <div class="mt-4 flex justify-end">
                  <a href="' . $link . '" target="_blank"
                    class="inline-flex items-center gap-2 font-medium text-sm text-white bg-slate-600 py-2 px-4 rounded-md hover:opacity-80">
                    <img src="./dist/img/clients/icons8-info.svg" alt="details-icon" class="inline-block ml-2 h-4 w-4" loading="lazy" decoding="async">
                    <span>Details</span>
                  </a>
                </div>
              </div>
            </div>
        ';
    }
}

$htmlTemplate = file_get_contents(__DIR__ . '/index.html');
$loadingMarkup = '<div class="col-span-full text-center py-20 opacity-50">Loading projects...</div>';

if ($htmlTemplate === false) {
    http_response_code(500);
    echo 'Failed to load template.';
    exit;
}

if (!empty($portfolioCards)) {
    $htmlTemplate = str_replace($loadingMarkup, $portfolioCards, $htmlTemplate);
}

echo $htmlTemplate;
?>
