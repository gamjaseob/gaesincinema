from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user

app = Flask(__name__)

#DB용
app.config.from_object('config.Config')
db = SQLAlchemy(app)

# Flask-Login 설정
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# User 모델
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

# 사용자 로드 함수
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# logout
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main'))

# main.html
@app.route('/')
def main():
    return render_template('main.html', current_user=current_user)

# login.html
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('main'))
        else:
            flash('아이디 또는 비밀번호가 잘못되었습니다.', 'danger')
    return render_template('login.html')

# signup.html
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        name = request.form['name']
        email = request.form['email']
        
        if User.query.filter_by(username=username).first():
            flash('아이디가 이미 존재합니다.', 'danger')
            return redirect(url_for('signup'))
        
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        new_user = User(username=username, password=hashed_password, name=name, email=email)
        db.session.add(new_user)
        db.session.commit()
        flash('회원가입 성공!', 'success')
        return redirect(url_for('login'))
    
    return render_template('signup.html')


# booking.html
@app.route('/booking')
def booking():
    return render_template('booking.html', current_user=current_user)

# details1.html
@app.route('/details1')
def details1():
    return render_template('details1.html', current_user=current_user)

# details2.html
@app.route('/details2')
def details2():
    return render_template('details2.html', current_user=current_user)

# details3.html
@app.route('/details3')
def details3():
    return render_template('details3.html', current_user=current_user)

# details4.html
@app.route('/details4')
def details4():
    return render_template('details4.html', current_user=current_user)

# details5.html
@app.route('/details5')
def details5():
    return render_template('details5.html', current_user=current_user)

# details6.html
@app.route('/details6')
def details6():
    return render_template('details6.html', current_user=current_user)

# details7.html
@app.route('/details7')
def details7():
    return render_template('details7.html', current_user=current_user)

# details8.html
@app.route('/details8')
def details8():
    return render_template('details8.html', current_user=current_user)

# details9.html
@app.route('/details9')
def details9():
    return render_template('details9.html', current_user=current_user)


# payment.html
@app.route('/payment')
def payment():
    return render_template('payment.html', current_user=current_user)

# cancel.html
@app.route('/cancel')
def cancel():
    return render_template('cancel.html', current_user=current_user)

# cancel.html
@app.route('/cancel2')
def cancel2():
    return render_template('cancel2.html', current_user=current_user)

#앱 시작
if __name__ == '__main__':
    #데이터베이스 생성
    with app.app_context():
        db.create_all()
    app.run(debug=True)