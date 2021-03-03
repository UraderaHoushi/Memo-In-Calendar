# Memo-In-Calendar
カレンダー型のメモです

*使い方*  
MySQLをインストールし、以下のコマンドでDB・テーブルを作成  
■DB  
CREATE DATABASE calendar;

■テーブル  
CREATE TABLE data (id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,year VARCHAR(4),month VARCHAR(4),day VARCHAR(4),memo VARCHAR(255),flag INT DEFAULT 0);  

nodejs.jsの10,11行目にMySQLアカウントを入力  
  
サービスを開始すれば、image.pugのような画面が表示されます
