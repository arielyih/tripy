new Vue({
  el: '#wrap',
  data: {
    datas: '',
    title: '',
    during_days: 0,
    startDate: '',
    endDate: '',
    days: [],
    activeIdx: 0,
    dates: [],
    places: []
  },
  computed: {
    liWidth: function() {
      return 'width: calc(100% / ' + this.during_days + ' / 2)';
    },
    ulWidth: function() {
      return 'width: calc((100% + 30px) * ' + this.during_days + ')';
    }
  },
  watch: {
    activeIdx: function(val) {
      var translateVal = val * 100,
        valIdx = parseInt(val) + 1;
      $('.trip-days').find('>li').css('transform', 'translateX(-' + translateVal + '%) scale(0.95)');
      $('.trip-days').find('>li:nth-of-type(' + valIdx + ')').css('transform', 'translateX(-' + translateVal + '%) scale(1)');
    }
  },
  mounted: function() {
    this.getData();
  },
  methods: {
    getData: function() {
      // Your web app's Firebase configuration
      var firebaseConfig = {
          apiKey: "AIzaSyC-RDjXEErSk9epkOItWDJ-0qskUnR2M-Q",
          authDomain: "my-project-1560751662386.firebaseapp.com",
          databaseURL: "https://my-project-1560751662386.firebaseio.com",
          projectId: "my-project-1560751662386",
          storageBucket: "my-project-1560751662386.appspot.com",
          messagingSenderId: "547570819382",
          appId: "1:547570819382:web:ddef8656f23069a2579397"
        },
        db,
        settings,
        docRef,
        $vm = this;

      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      db = firebase.firestore();

      settings = { timestampsInSnapshots: true };
      db.settings(settings);

      docRef = db.collection("trip").doc("BZ8oKl1cBw6geVYBRfbF");
      docRef.get().then(function(doc) {
          if (doc.exists) {
            console.log(doc.data());
            $vm.datas = doc.data();
            $vm.title = $vm.datas.title;
            $vm.during_days = $vm.datas.dayDuration;
            $vm.places = $vm.datas.places;
            $vm.startDate = $vm.datas.year + ' / ' + $vm.datas.month + ' / ' + $vm.datas.day;
            // $vm.days = $vm.datas.days;
            if ($vm.datas.days.length > 0) {
              $.each($vm.datas.days, function(idx, val) {
                $vm.days[val.order] = val.events;
              });
            }
            if ($vm.days.length < $vm.during_days) {
              $vm.days.length = $vm.during_days;
            }
            $vm.endDate = $vm.calEndDate($vm.startDate.replace(' ', ''), $vm.during_days);
            $vm.calDate();
          } else {
            console.log("找不到文件");
          }
        })
        .catch(function(error) {
          console.log("提取文件時出錯:", error);
        });
    },
    calEndDate: function(dayStart, during) {
      var date = new Date(dayStart),
        newdate = new Date(date),
        dd,
        mm,
        y;

      newdate.setDate(newdate.getDate() + (during - 1));

      dd = newdate.getDate();
      mm = newdate.getMonth() + 1;
      y = newdate.getFullYear();

      return y + ' / ' + mm + ' / ' + dd;
    },
    calDate: function() {
      var $vm = this;

      $vm.dates.push($vm.startDate);

      for (var i = 0; i < ($vm.during_days - 2); i++) {
        $vm.dates.push($vm.calEndDate(($vm.dates[i]).replace(' ', ''), 2));
      }

      $vm.dates.push($vm.endDate);
    },
    daysClick: function($elm) {
      this.activeIdx = $elm - 1;
    },
    slideLeftClick: function(idx) {
      console.log(idx);
      this.activeIdx = idx - 1;
    },
    slideRightClick: function(idx) {
      this.activeIdx = idx + 1;
    }
  }
});