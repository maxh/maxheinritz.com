---
layout: default
class: home
---
<div class="columns">
  {% for project in site.projects %}
    <a href="{{ project.url }}">
      <div class="pin {% if project.break %} break {% endif %}">
        <img src="/images/{{ project.images.first }}">
      </div>
    </a>
  {% endfor %}
</div>
