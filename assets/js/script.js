// Get commit info
$(document).ready(function () {
    const username = "veryuniqueusrnm";
    const repo = "veryuniqueusrnm.github.io";
    const apiUrl = `https://api.github.com/repos/${username}/${repo}/commits`;

    $.getJSON(apiUrl, function (data) {
        if (!data || data.length === 0) return;

        const latestCommit = data[0];
        const commitId = latestCommit.sha.substring(0, 7);
        const commitDate = new Date(latestCommit.commit.author.date).toLocaleDateString();
        const commitMessage = latestCommit.commit.message;
        const commitUrl = latestCommit.html_url;

        $("#commit-info").html(
            `Latest commit: <strong><a class="link" href="${commitUrl}" target="_blank">${commitId}`
        );
    }).fail(function () {
        console.error("Failed to fetch commit data.");
    });
});