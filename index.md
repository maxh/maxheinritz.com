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

**A few open-source contributions**

- [RuboCop](https://github.com/rubocop-hq/rubocop/pulls?q=is%3Apr+author%3Amaxh+is%3Aclosed)
- [Earth Engine layers](https://github.com/google/earthengine-api/commit/7110809ce760ab187afa43cb20e349e54b0f62b3#diff-85588e2d3225963a73d9cf4e21bdf240)

**Misc related internets**

- [faircompanies video](https://www.youtube.com/watch?v=6tYaI3At4fs)
- [Uses This interview](https://usesthis.com/interviews/max.heinritz/)

<!-- Randomize the order of the project pictures -- just for fun! -->
<script>
  const list = document.querySelector('.columns');
  for (let i = list.children.length; i >= 0; i--) {
    list.appendChild(list.children[Math.random() * i | 0]);
  }
</script>
