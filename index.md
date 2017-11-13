---
layout: default
class: home
---
<div class="columns">
  {% for project in site.projects %}
    <a href="{{ project.url }}">
      <div class="pin">
        <img src="/images/{{ project.images.first }}">
      </div>
    </a>
  {% endfor %}
</div>

## Digital projects

- [Idea Reminder](http://www.ideareminder.org/)
- [Gratitude Reminder](http://www.gratitudereminder.org/)
- [Mid-Market Status](http://www.midmarketstatus.com/)
