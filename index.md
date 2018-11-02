---
layout: default
class: home
---
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


**Other (less pretty) projects**
- [Idea Reminder](https://www.ideareminder.org)
- [Gratitude Reminder](https://www.gratitudereminder.org)
- [Mid-Market Status](http://midmarketstatus.com)
- [Church of Silentology](https://churchofsilentology.com)

<script>
  const list = document.querySelector('.columns');
  for (let i = list.children.length; i >= 0; i--) {
    list.appendChild(list.children[Math.random() * i | 0]);
  }
</script>
