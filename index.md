---
layout: default
---

<div class="home post-content">
   <header>
      <div class="showcase">
         <h1>VeryUniqueUsrnm</h1>
         <p>Files, resources, news</p>
      </div>
   </header>
   <hr>
   <section>
      <div class="row-3">
         <article class="column">
            <h3>Resource Packs</h3>
            <section>
               <p class="component-body">Developing interesting resource packs since 2025!</p>
            </section>
            <a class="button secondary" href="https://modrinth.com/user/VeryUniqueUsrnm" target="_blank">Learn More</a>
         </article>
      </div>
   </section>
   <hr>
   <section>
   <h3>Archived Stuff</h3>
   <ul>
      <li><a href="https://archive.org/details/vilagbajnok-vilagbajnoksag" target="_blank">Világbajnok Világbajnokság</a> M. Kiss Csaba dokumentumnaplója a 2023-as budapesti atlétikai világbajnokságról.</li>
      <li><a href="https://archive.org/details/tipszmiksz-csabi-es-a-folyekonypofaju-hal" target="_blank">Tipszmiksz Csabi és a folyékony pofájú hal</a> Minusz negyvenhét 🦊, egy folyékony pofájú hal, egy T-1000-es modell...</li>
      <li><a href="https://archive.org/details/wabudapest23-opening-ceremony-uncut-hungarian" target="_blank">2023-as Budapesti Atlétikai Világbajnokság megnyitó ceremónia</a> 2023-as Budapesti Atlétikai Világbajnokság megnyitó ceremónia. Felvéve TV-ből, vágatlan.</li>
      <li><a href="https://archive.org/details/meet-youhuu-the-mascot-of-the-world-athletics-championships-budapest-23" target="_blank">Meet Youhuu, The Mascot Of The World Athletics Championships Budapest 23</a> Meet Youhuu, The Mascot Of The World Athletics Championships Budapest 23</li>
      <li><a href="https://archive.org/details/telenor-webiroda-hun" target="_blank">Telenor Webiroda</a> Telenor Webiroda bemutató videó.</li>
      <li><a href="https://archive.org/details/vscode_for_legacy_windows" target="_blank">Microsoft Visual Studio Code version 1.79 for legacy Windows versions</a> Latest release of Microsoft VSCode for Windows 7, 8 and 8.1.</li>
      <li><a href="https://archive.org/details/discord-for-legacy-windows" target="_blank">Discord for Windows 7, 8 and 8.1</a> The latest version of Discord that still runs on legacy Windows versions.</li>
   </ul>
   </section>
   <hr>
   <section>
      <h3>Latest Blog Posts</h3>
      <div class="row-2">
         {% for post in site.posts limit: 2 %}
         <article class="column">
            <a href="{{ post.url }}">
               <h4>{{ post.title }}</h4>
            </a>
            <section>
               <p>{{ post.content | strip_html | truncate: 310 }}</p>
            </section>
            <a class="button secondary" href="{{ post.url }}">Continue reading</a>
         </article>
         {% endfor %}
      </div>
   </section>
</div>
