---
title: "Secure Hardware for Constant-time Programs"
tags:
  - "architecture"
  - "security"
  - "speculative execution"
  - "constant-time programs"
venue: "Arch-Sec Lab, MIT"
path: "research/sechw-const-time"
excerpt: "This is an ongoing project at MIT about protecting constant-time programs against transient attacks that leak secrets. It is advised by Prof. Mengjia Yan & Prof. Adam Chlipala, and conducted by me and several great Ph.D. students."
selected: true
cover: "./sechw-const-time.png"
priority: 20
---

## Motivation

Constant-time programs are vulnerable when executed speculatively. 

Previous studies have proposed protections that disable speculation on secret data, but the overhead depends on how precisely public data and secret data are distinguished.

I studied several prior works on transient attack protections and discovered that some made massive hardware changes for precision, others introduced mild hardware features but were in coarse granularity or relied on manual binary patching.

With the observations, I sought to leverage properties of constant-time programs and software analysis to <u>simplify the hardware while maintaining high precision in secret classification</u>.

## Approaches

I managed to relieve the hardware by assigning each page a static label of being secret or not, instead of maintaining each byte’s secret status dynamically.

Since a stack page may encompass both public and secret data, I designed an ahead-of-time analysis framework that automates the rearrangement of the stack layout of binary, moving secret objects to a shadow stack on another page.

I implemented the simplified hardware features including taint tracking and defense mechanisms in Gem5, as well as a dynamic binary instrumentation plugin in Valgrind which helps analyze the binary and re-write the instructions to separate public and secret data on the stack.

The project is still ongoing.