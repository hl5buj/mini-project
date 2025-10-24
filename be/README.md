# Learning Platform Backend API

학습 플랫폼 백엔드 - Django REST Framework 기반

## 기능

- 사용자 인증 (JWT)
- 강의 관리 (CRUD)
- 비디오/문서 업로드 및 스트리밍
- 댓글 시스템 (Q&A)
- 검색 및 필터링

## 기술 스택

- Python 3.x
- Django 5.0.1
- Django REST Framework 3.14.0
- PostgreSQL (Production) / SQLite (Development)
- JWT Authentication

## 설치 및 실행

### 1. 가상환경 생성 및 활성화

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### 2. 패키지 설치

```bash
pip install -r requirements.txt
```

### 3. 환경 변수 설정

```bash
cp .env.example .env
# .env 파일을 열어 설정 수정
```

### 4. 데이터베이스 마이그레이션

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. 슈퍼유저 생성

```bash
python manage.py createsuperuser
```

### 6. 서버 실행

```bash
python manage.py runserver
```

## API 문서

- Swagger UI: http://127.0.0.1:8000/api/schema/swagger-ui/
- ReDoc: http://127.0.0.1:8000/api/schema/redoc/
- OpenAPI Schema: http://127.0.0.1:8000/api/schema/

## 관리자 페이지

http://127.0.0.1:8000/admin/

## 앱 구조

- `accounts/` - 사용자 인증 및 프로필
- `courses/` - 강의 관리
- `lectures/` - 레슨 관리
- `media/` - 파일 업로드 및 스트리밍
- `comments/` - 댓글 시스템
