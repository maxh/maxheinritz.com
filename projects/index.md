---
title: Projects
layout: default
---

<h1>{{page.title}}</h1>

<div class="columns">
  {% for project in site.projects %}
    {% if project.title != "Fox Mask" %}
      <a href="{{ project.url }}">
        <div class="pin">
          <img src="/images/{{ project.images.first }}">
        </div>
      </a>
    {% endif %}
  {% endfor %}
</div>

<!-- Randomize the order of the project pictures -- just for fun! -->
<script>
  const root = document.querySelector('.columns');
  shuffleForToday(root.children).forEach(child => root.appendChild(child));
</script>
