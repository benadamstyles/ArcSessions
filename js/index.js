---
---

{% include tap.min.js %}
{% include rivets.bundled.min.js %}
{% include echo.min.js %}

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

window.S={
  videoArray: [
    {% for video in site.data.videos %}
    {
      id: "{{ video.id }}",
      firstName: "{{ video.firstName }}",
      lastName: "{{ video.lastName }}",
      title: "{{ video.title }}",
      date: "{{ video.date }}",
      duration: "{{ video.duration }}"
    },
    {% endfor %}
  ],
  init: function() {
    var listItems=document.querySelectorAll('.post-list > li'),
        list=document.querySelector('.post-list'),
        itemsArray=[],
        vidEls=document.getElementsByClassName("youtube"),
        model;
    function loadYouTube() {
      var iframe;
      iframe=document.createElement("iframe");
      iframe.setAttribute("src", "//www.youtube-nocookie.com/embed/"+this.id+"?rel=0&amp;controls=0&amp;showinfo=0&amp;autoplay=1");
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("allowfullscreen", "allowfullscreen");
      iframe.width=this.style.width;
      iframe.height=this.style.height;
      this.parentNode.replaceChild(iframe, this);
      iframe.parentNode.style.opacity="1";
    }
    function sort(by) {
      var pos,sortedEls,new_ul,param=by;
      function convertToSecs(str) {
        var s=str.slice(0,-1),a=s.split('m ');
        a[0]=parseInt(a[0],10);
        a[1]=parseInt(a[1],10);
        return a[0]*60 + a[1];
      }
      model.array.sort(function(a,b) {
        var A=a.obj,B=b.obj,aSecs,bSecs;
        if (param==='duration') {
          aSecs=convertToSecs(A.duration);
          bSecs=convertToSecs(B.duration);
          if (aSecs>bSecs) {return 1;}
          if (aSecs<bSecs) {return -1;}
        } else {
          if (A[param]>B[param]) {return 1;}
          if (A[param]<B[param]) {return -1;}
        }
        return 0;
      });
      console.log(model.array.map(function(v) {return v.obj.lastName;}));
      sortedEls=model.array.map(function(v) {return v.el;});
      new_ul=list.cloneNode(false);
      for (var i = 0; i < sortedEls.length; i++) {
        new_ul.appendChild(sortedEls[i]);
      }
      list.parentNode.replaceChild(new_ul,list);
      list=new_ul;
    }

    model={
      array: itemsArray,
      sort_poet: function() {
        sort('lastName');
      },
      sort_date: function() {
        sort('date');
      },
      sort_duration: function() {
        sort('duration');
      },
      filter: function(event) {
        var q=this.value;
        function check(el) {
          function finder(v) {return v.el.id===el.lastName;}
          for (var key in el) {
            if (~el[key].toLowerCase().indexOf(q)) {
              itemsArray.find(finder).el.style.display="block";
              return;
            } else {
              itemsArray.find(finder).el.style.display="none";
            }
          }
        }
        for (var i=0;i<S.videoArray.length;i++) {
          check(S.videoArray[i]);
        }
      }
    };

    // init() -->
    echo.init({
      offset: 100,
      throttle: 250,
      unload: false/*,
      callback: function (element, op) {
        console.log(element, 'has been', op + 'ed')
      }*/
    });

    for (var i=0;i<vidEls.length;i++) {
      vidEls[i].addEventListener('click',loadYouTube,false);
    }
    for (var j=0;j<listItems.length;j++) {
      itemsArray.push({el:listItems[j],obj:S.videoArray[j]});
    }

    rivets.bind(document.querySelector('div.home'),model);
  }
};

document.addEventListener('DOMContentLoaded',S.init,false);
