---
layout: base
title: Search
---

<style>
div.search {
    position: relative;
    width: 160px;
    padding: 10px;
    border: 1px solid #606060;
    border-radius: 10px;
}

div.search form fieldset {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
}

div.search form fieldset div.field.keyword input {
    position: relative;
    display: block;
    width: 160px;
    height: 15px;
    margin: 0px;
    padding: 3px 0px 2px 0px;
    overflow: hidden;
    border: none 0px;
    color: #606060;
    background: transparent;
    font-size: 13px;
    line-height: 16px;
}

.search .results {
    position: absolute;
    top: 100%;
    left: -140px;
    width: 300px;
    max-height: 400px;
    overflow-y: auto;
    margin-top: 5px;
    padding: 10px;
    background: #fff;
    border: 1px solid #606060;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    z-index: 1000;
    display: none;
}

div.center.searchpage {
    min-height: 500px !important;
}
</style>

<div class="center searchpage">
    <div class="search">
        <form id="head_search_form">
            <fieldset>
                <div class="field keyword"><input type="text" id="q" name="q" autocomplete="off" value="" placeholder="Type here to search..."/></div>
            </fieldset>
        </form>
        <div class="results" id="search_result"></div>
    </div>
</div>