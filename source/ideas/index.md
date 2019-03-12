---
title: 灵感和归纳
date: 2019-03-02 11:24:28
---

<div class="test">
  {% for post in site.posts %}
    <li>{{ loop.index }} {{ loop.key }} {{ post.title }}</li>
  {% endfor %}
</div>
