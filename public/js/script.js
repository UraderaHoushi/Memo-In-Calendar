(function() {
    'use strict';

    var field = document.getElementById('field');
    var YM = document.getElementById('YM');
    var nowDate = new Date();
    var thisYear = nowDate.getFullYear();
    var thisMonth = nowDate.getMonth();
    var todayY = nowDate.getFullYear();
    var todayM = nowDate.getMonth();
    var todayD = nowDate.getDate();
    var lastDay = new Date(thisYear, thisMonth + 1, 0).getDate();
    var days = [];
    var youbi = ['日','月','火','水','木','金','土'];
    
    pushDateWeek();   
    getData();

    //配列に対象年月の日付、曜日を格納
    function pushDateWeek() {
        for (var i=1; i<lastDay + 1; i++) {
            var dayOfMonth = new Date(thisYear, thisMonth, i);
            var d = dayOfMonth.getDate();
            var w = dayOfMonth.getDay();
            days.push({date:d, week:w});
        };
        
        headFill();
        endFill();
    };

    //配列先頭の空白埋め
    function headFill() {
        if (days[0].week != 0) {
            for (var i=days[0].week - 1; i>-1; i--) {
                days.unshift({date:'', week:i});
            };
        };    
    };

    //配列末尾の空白埋め
    function endFill() {
        if (days[days.length - 1].week != 6) {
            for (var i=days[days.length - 1].week + 1; i<7; i++) {
                days.push({date:'', week:i});
            };
        };    
    };

    //dbからデータを取得
    function getData(delflag) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/req-data', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.responseType = 'json';

        var postData = `year=${thisYear}&month=${thisMonth}`;
        console.log(postData);
        xhr.send(postData);
        xhr.onreadystatechange = function(){   
            if(xhr.readyState == 4 && xhr.status == 200){
                console.log('DONE:リクエスト完了') 
                render(xhr.response, delflag);
            }
        }
    };

    //html形式で描画
    function render(dbdata, flag) {
        if (flag == 1) {
            var back = document.getElementById('backmonth');
            var next = document.getElementById('nextmonth');
            var cal = document.getElementById('calendar');
            removeItems(back, next, cal);
        }
        var backMonth = document.createElement('button');
        backMonth.setAttribute('id', 'backmonth');
        backMonth.textContent = `前月`;
        backMonth.addEventListener('click', function() {
            console.log('back' + backMonth);
            console.log(nextMonth);
            console.log(calendar);
            removeItems(backMonth, nextMonth, calendar);
            thisYear = new Date(thisYear, thisMonth - 1, 1).getFullYear();
            thisMonth = new Date(thisYear, thisMonth - 1, 1).getMonth();
            lastDay = new Date(thisYear, thisMonth + 1, 0).getDate();
            days.length = 0;

            pushDateWeek();
            getData();
        });

        var nextMonth = document.createElement('button');
        nextMonth.setAttribute('id', 'nextmonth');
        nextMonth.textContent = `次月`;
        nextMonth.addEventListener('click', function() {
            removeItems(backMonth, nextMonth, calendar);
            thisYear = new Date(thisYear, thisMonth + 1, 1).getFullYear();
            thisMonth = new Date(thisYear, thisMonth + 1, 1).getMonth();
            lastDay = new Date(thisYear, thisMonth + 1, 0).getDate();
            days.length = 0;

            pushDateWeek();
            getData();
        });

        YM.insertAdjacentElement('beforebegin', backMonth);
        YM.insertAdjacentElement('afterend', nextMonth);
        YM.textContent = ` ${thisYear}年${thisMonth + 1}月 `;

        var calendar = document.createElement('table');
        calendar.setAttribute('id', 'calendar');
        calendar.setAttribute('border', 1);
        calendar.classList.add('calendars');

        var rowHead = document.createElement('tr');

        for (var i=0; i<7; i++) {
            var dataHead = document.createElement('th');
            dataHead.textContent = (youbi[i]);
            checkweekendHead(i, dataHead);
            rowHead.appendChild(dataHead);
        }
        calendar.appendChild(rowHead);

        for (var i=0; i<days.length - 1; i+=7 ) {
            var rowItem = document.createElement('tr');
            for (var j=0+i; j<7+i; j++) {
                var dataItem = document.createElement('td');
                dataItem.classList.add('datefield');
                var dayfield = document.createElement('p');
                dayfield.textContent = days[j].date;
                dataItem.appendChild(dayfield);
                checkweekend(days[j].week, dataItem);
                Adddatefield(days[j].date, dataItem, dbdata);
                rowItem.appendChild(dataItem);
            };
            calendar.appendChild(rowItem);
        };
        field.appendChild(calendar);
    };
    
    //土日ヘッダーセルの文字に色を付ける
    function checkweekendHead(num, obj) {
        var wdcolor = null;
        if (num == 0) {
            wdcolor =  'Sunday';
        } else if (num == 6) {
            wdcolor =  'Saturday';
        };
        if (wdcolor != null) {
            obj.id = (wdcolor);
        };
    }

    //土日データセルに背景色を付ける
    function checkweekend(num, obj) {
        var bgcolor = null;
        if (num == 0) {
            bgcolor =  'SundayColumns';
        } else if (num == 6) {
            bgcolor =  'SaturdayColumns';
        };
        if (bgcolor != null) {
            obj.classList.add(bgcolor);
        };
    };

    //本日日付データセルに色を付ける、セル内各要素の配置
    function Adddatefield(num, obj, data) {
        if (thisYear == todayY && thisMonth == todayM && num == todayD) {
            obj.id = 'today';
        }
        if (num != '') {
            var inputForm = document.createElement('div');
            inputForm.setAttribute('style','display:inline-flex')
            
            
            var inputField = document.createElement('input');
            inputField.setAttribute('type', 'text');
            inputField.setAttribute('name',`inputField`);

            var hDay = document.createElement('input');
            hDay.setAttribute('type', 'hidden');
            hDay.setAttribute('name', 'day');
            hDay.setAttribute('value', num);
            
            var addButton = document.createElement('button');
            addButton.setAttribute('type', 'submmit');
            addButton.setAttribute('class', 'Add');
            addButton.textContent = 'Add';
            addButton.addEventListener('click',function() {
                post(hDay, inputField);
            })
            
            var textLine = document.createElement('ul');
            for(var i = 0; i < data.length; i++) {
                if(data[i].day == num) {
                    createMemoField(textLine, data, i);

                }
            }

            inputForm.appendChild(inputField);
            inputForm.appendChild(hDay);
            inputForm.appendChild(addButton);
            
            obj.appendChild(inputForm);
            obj.appendChild(textLine);   
        }
    }

    function createMemoField(obj, data, num) {
        var list = document.createElement('li');
        var memo = document.createElement('span');
        memo.setAttribute('id', data[num].id);
        memo.setAttribute('class', 'Delete');
        memo.textContent = data[num].memo;
        
        var deleteButton = document.createElement('button');
        deleteButton.setAttribute('name', 'delete');
        deleteButton.setAttribute('class', 'Delete');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click',function() {
            console.log(memo);
            postDelete(memo.id);
        })
        list.appendChild(memo);
        list.appendChild(deleteButton);
        obj.appendChild(list);
    }


    //Add押下後、DBへテキストボックス内文字列を登録
    function post(day, data) {
        var xhr = new XMLHttpRequest();

        xhr.open('POST', '/req-post-A', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        var postData = `year=${thisYear}&month=${thisMonth}&day=${day.value}&data=${data.value}`;
        xhr.send(postData);
        xhr.onreadystatechange = function(){   
            if(xhr.readyState == 4 && xhr.status == 200){
                console.log('DONE:追加リクエスト完了');
                getData(1);
            }
        }
    }

    //Delete押下後、DB内データを論理削除
    function postDelete(id) {
        var xhr = new XMLHttpRequest();

        xhr.open('POST', '/req-post-D', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        var postData = `id=${id}`;
        xhr.send(postData);
        xhr.onreadystatechange = function(){   
            if(xhr.readyState == 4 && xhr.status == 200){
                console.log('DONE:削除リクエスト完了');
                getData(1);
            }
        }
    }

    //画面読み込み時、旧要素を削除
    function removeItems(back, next, cal) {
        back.remove();
        next.remove();
        cal.remove();
    }

} ());