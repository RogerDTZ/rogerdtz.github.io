---
title: 灵感和归纳
date: 2019-03-02 11:24:28
---

<div class="col-1">
<h1>Articles</h1>
  <% ...each(function(...){ %>
    <%- partial('article', {post: ..., index: true}) %>
  <% }) %>
</div>
<div class="col-2">
<h1>Notes</h1>
  <% ...each(function(...){ %>
    <%- partial('note', {post: ..., index: true}) %>
  <% }) %>
</div>
<div class="col-3">
<h1>Projects</h1>
  <% ...each(function(...){ %>
    <%- partial('project', {post: ..., index: true}) %>
  <% }) %>
</div>
