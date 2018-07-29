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

<script>
  const list = document.querySelector('.columns');
  for (let i = list.children.length; i >= 0; i--) {
    list.appendChild(list.children[Math.random() * i | 0]);
  }
</script>
