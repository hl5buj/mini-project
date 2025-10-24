---
name: drf-react-development
description: Guide Claude through structured Django REST Framework (DRF) backend analysis and React frontend development with Vite. This skill provides step-by-step workflow for API analysis, requirement engineering, React implementation, security hardening, optimization, and stage-gated development process. Use this skill when the user requests React frontend development based on a Django/DRF backend API, or mentions DRF, React, Vite, axios, security configurations, or performance optimization in web development contexts.
---

# DRF-React Development Skill

이 스킬은 Django REST Framework 백엔드 API를 분석하고, 이를 기반으로 React 프론트엔드를 단계별로 개발하는 구조화된 프로세스를 제공합니다.

## 개발 철학

1. **단계별 승인 프로세스**: 각 단계를 완료한 후 사용자의 승인을 받고 다음 단계로 진행
2. **보안 최우선**: 모든 단계에서 보안을 최우선으로 고려
3. **최적화 중심**: 성능과 사용자 경험을 위한 최적화 적용
4. **체계적 문서화**: 각 단계에서 수행한 작업을 명확하게 레포팅
5. **커맨드 명령은 사용자가 수행**: 단계별로 필요한 커맨드는 사용자가 수행하도록 진행행

## 개발 단계

### Phase 1: 백엔드 API 분석 및 요구사항 도출

**목적**: DRF 백엔드의 API 구조를 완전히 이해하고 프론트엔드 요구사항을 명확히 정의

**작업 항목**:

1. **API 엔드포인트 분석**
   - 모든 API 엔드포인트 목록화
   - HTTP 메서드(GET, POST, PUT, PATCH, DELETE) 확인
   - 요청/응답 데이터 구조 파악
   - 인증/권한 요구사항 확인
   
2. **데이터 모델 이해**
   - 백엔드 모델 구조 분석
   - 관계(ForeignKey, ManyToMany) 파악
   - 필드 타입 및 제약사항 확인

3. **인증 및 권한 체계 파악**
   - 인증 방식(Token, JWT, Session 등) 확인
   - 권한 레벨 및 접근 제어 정책 분석
   - CORS 설정 확인

4. **요구사항 문서 작성**
   - 기능 요구사항 정리
   - 비기능 요구사항(성능, 보안, UX) 정의
   - 화면 구성 및 사용자 플로우 설계

**산출물**:
- API 명세서 (엔드포인트, 메서드, 파라미터, 응답 형식)
- 데이터 모델 다이어그램
- 요구사항 문서
- 화면 설계 와이어프레임(필요시)

**레포팅 내용**:
- 분석된 API 개수 및 주요 기능
- 식별된 보안 요구사항
- 도출된 주요 기능 요구사항
- 다음 단계 진행을 위한 확인 사항

---

### Phase 2: 프로젝트 초기 설정

**목적**: React + Vite 프로젝트 구조를 설정하고 필수 라이브러리를 구성

**작업 항목**:

1. **Vite React 프로젝트 생성**
```bash
   npm create vite@latest project-name -- --template react
   cd project-name
   npm install
```

2. **필수 패키지 설치**
```bash
   # API 통신
   npm install axios
   
   # 라우팅
   npm install react-router-dom
   
   # 상태 관리 (선택적)
   npm install zustand
   # 또는 npm install @reduxjs/toolkit react-redux
   
   # UI 라이브러리 (선택적)
   npm install @mui/material @emotion/react @emotion/styled
   # 또는 npm install antd
   
   # 폼 관리
   npm install react-hook-form
   
   # 유틸리티
   npm install date-fns lodash
```

3. **프로젝트 구조 설정**
```
   src/
   ├── api/                 # API 관련 코드
   │   ├── client.js        # axios 인스턴스
   │   ├── endpoints.js     # API 엔드포인트 정의
   │   └── services/        # API 서비스 함수들
   ├── components/          # 재사용 가능한 컴포넌트
   │   ├── common/          # 공통 컴포넌트
   │   └── features/        # 기능별 컴포넌트
   ├── config/              # 환경 설정
   │   └── constants.js     # 상수 정의
   ├── contexts/            # React Context (전역 상태)
   ├── hooks/               # 커스텀 훅
   ├── layouts/             # 레이아웃 컴포넌트
   ├── pages/               # 페이지 컴포넌트
   ├── routes/              # 라우팅 설정
   ├── store/               # 상태 관리 (zustand/redux)
   ├── styles/              # 전역 스타일
   ├── utils/               # 유틸리티 함수
   ├── App.jsx
   └── main.jsx
```

4. **환경 변수 설정**
   - `.env` 파일 생성 (Git에서 제외)
   - `.env.example` 템플릿 생성
```env
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_API_TIMEOUT=10000
```

5. **Axios 클라이언트 설정**
   - 인터셉터를 이용한 인증 토큰 자동 삽입
   - 에러 핸들링
   - 요청/응답 로깅 (개발 모드)

**산출물**:
- 초기화된 프로젝트 구조
- 환경 설정 파일
- Axios 클라이언트 설정 코드
- README.md (프로젝트 설정 및 실행 방법)

**레포팅 내용**:
- 설치된 패키지 목록 및 용도
- 프로젝트 구조 설명
- 환경 변수 설정 가이드
- 개발 서버 실행 방법

---

### Phase 3: 보안 설정 구현

**목적**: 프론트엔드 보안을 강화하고 안전한 통신 환경 구축

**작업 항목**:

1. **XSS(Cross-Site Scripting) 방어**
   - React의 기본 XSS 방어 메커니즘 활용
   - `dangerouslySetInnerHTML` 사용 최소화
   - 사용자 입력 데이터 검증 및 이스케이프
   - DOMPurify 라이브러리 사용 (필요시)
```bash
   npm install dompurify
   npm install --save-dev @types/dompurify
```

2. **인증 및 권한 관리**
   - JWT 토큰 안전한 저장 (httpOnly 쿠키 권장, localStorage 사용 시 주의)
   - 토큰 갱신 메커니즘 구현
   - 보호된 라우트 구현 (PrivateRoute 컴포넌트)
   - 권한 기반 UI 렌더링
   - 자동 로그아웃 (토큰 만료 시)

3. **환경변수 및 민감 정보 관리**
   - `.env` 파일 `.gitignore`에 추가
   - 민감한 정보는 환경변수로 관리
   - API 키는 절대 클라이언트 코드에 하드코딩하지 않음
   - 프로덕션 환경에서는 환경변수를 빌드 시점에 주입

4. **의존성 보안**
   - `npm audit` 정기 실행
   - 취약한 패키지 업데이트
   - `package-lock.json` 버전 관리

5. **CSRF(Cross-Site Request Forgery) 방어**
   - Django의 CSRF 토큰과 연동
   - Axios 인터셉터에 CSRF 토큰 자동 포함
```javascript
   // CSRF 토큰을 쿠키에서 가져와 헤더에 추가
   axios.defaults.xsrfCookieName = 'csrftoken';
   axios.defaults.xsrfHeaderName = 'X-CSRFToken';
```

6. **Content Security Policy (CSP) 설정**
   - 적절한 CSP 헤더 설정 (백엔드와 협업)
   - 인라인 스크립트 최소화

7. **안전한 통신**
   - HTTPS 사용 (프로덕션 환경)
   - API 요청 시 항상 HTTPS 사용
   - Mixed Content 경고 해결

**산출물**:
- 보안이 강화된 Axios 클라이언트
- 인증/권한 관리 모듈
- PrivateRoute 컴포넌트
- 보안 관련 유틸리티 함수
- 보안 체크리스트 문서

**레포팅 내용**:
- 구현된 보안 기능 목록
- 보안 취약점 분석 결과
- 추가 보안 권장사항
- 보안 테스트 결과

---

### Phase 4: 핵심 기능 개발

**목적**: 백엔드 API와 연동된 주요 기능을 구현

**작업 항목**:

1. **API 서비스 레이어 구현**
   - 각 엔드포인트별 서비스 함수 작성
   - 에러 핸들링 표준화
   - 로딩 상태 관리
```javascript
   // src/api/services/userService.js
   export const userService = {
     getUsers: async (params) => {
       try {
         const response = await apiClient.get('/users/', { params });
         return response.data;
       } catch (error) {
         throw handleApiError(error);
       }
     },
     // ...
   };
```

2. **페이지 및 컴포넌트 개발**
   - Phase 1에서 정의한 화면별 페이지 컴포넌트 생성
   - 재사용 가능한 공통 컴포넌트 개발
   - 컴포넌트 분리 원칙 준수 (Atomic Design 패턴 권장)

3. **상태 관리 구현**
   - 전역 상태 관리 (Zustand/Redux)
   - 로컬 상태 관리 (useState, useReducer)
   - 서버 상태 관리 (React Query 권장)

4. **라우팅 구현**
   - React Router 설정
   - 중첩 라우팅
   - 동적 라우팅
   - 보호된 라우트

5. **폼 처리**
   - React Hook Form 활용
   - 유효성 검증
   - 에러 메시지 표시

**산출물**:
- API 서비스 함수들
- 페이지 컴포넌트
- 재사용 가능한 UI 컴포넌트
- 라우팅 설정
- 상태 관리 코드

**레포팅 내용**:
- 구현된 페이지 및 기능 목록
- 컴포넌트 구조도
- API 연동 현황
- 발견된 이슈 및 해결 방법

---

### Phase 5: 디자인 적용 (선택적)

**목적**: 참고 디자인을 분석하고 프로젝트에 맞게 적용

**작업 항목**:

1. **디자인 사이트 분석** (사용자가 URL 제공 시)
   - 색상 팔레트 추출
   - 타이포그래피 분석
   - 레이아웃 패턴 파악
   - UI 컴포넌트 스타일 수집

2. **디자인 시스템 구축**
   - 색상 변수 정의 (CSS Variables 또는 Theme)
   - 타이포그래피 스타일 정의
   - 간격(Spacing) 시스템
   - 그림자(Shadow) 효과

3. **스타일링 적용**
   - CSS Modules / Styled Components / Emotion 중 선택
   - 반응형 디자인 구현
   - 다크 모드 지원 (선택적)

4. **애니메이션 및 트랜지션**
   - 부드러운 사용자 경험을 위한 애니메이션 추가
   - 로딩 인디케이터
   - 페이지 전환 효과

**산출물**:
- 디자인 토큰 정의 파일
- 스타일 가이드 문서
- 스타일이 적용된 컴포넌트
- 반응형 레이아웃

**레포팅 내용**:
- 추출된 디자인 요소 정리
- 적용된 스타일링 기법
- 반응형 브레이크포인트
- 접근성 고려사항

---

### Phase 6: 최적화

**목적**: 애플리케이션의 성능과 사용자 경험을 최적화

**작업 항목**:

1. **렌더링 최적화**
   - `React.memo()` 활용하여 불필요한 리렌더링 방지
   - `useMemo()`, `useCallback()` 훅 적절히 사용
   - Virtual DOM 렌더링 최적화
   - 리스트 렌더링 시 `key` prop 최적화

2. **상태 관리 최적화**
   - 상태 분리 및 정규화
   - 컴포넌트 간 불필요한 상태 공유 최소화
   - Context API 사용 시 적절한 분리
   - Selector 함수 메모이제이션

3. **코드 스플리팅 및 레이지 로딩**
   - React.lazy()와 Suspense를 이용한 코드 스플리팅
   - 라우트 기반 코드 스플리팅
   - 컴포넌트 레벨 레이지 로딩
   - 동적 import 활용
```javascript
   const Dashboard = lazy(() => import('./pages/Dashboard'));
```

4. **이미지 및 미디어 최적화**
   - 이미지 압축 및 최적화
   - WebP 포맷 사용
   - Lazy loading 적용 (Intersection Observer)
   - Responsive images (`srcset`, `sizes` 속성)
   - SVG 최적화

5. **네트워크 최적화**
   - API 요청 캐싱 (React Query 또는 SWR)
   - Debounce/Throttle 적용 (검색, 스크롤 등)
   - 병렬 요청 최적화
   - Prefetching 전략
   - Service Worker를 이용한 오프라인 지원 (선택적)

6. **빌드 최적화**
   - Vite의 빌드 설정 최적화
   - Tree shaking 활용
   - Bundle 크기 분석 (`rollup-plugin-visualizer`)
   - 불필요한 의존성 제거
   - Production 빌드 최적화
```javascript
   // vite.config.js
   export default {
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['react', 'react-dom'],
             router: ['react-router-dom'],
           }
         }
       }
     }
   }
```

7. **메모리 관리**
   - 이벤트 리스너 정리 (useEffect cleanup)
   - 타이머 정리 (setTimeout, setInterval)
   - 구독 해제 (subscriptions)
   - 메모리 누수 방지

**산출물**:
- 최적화된 컴포넌트 코드
- Vite 빌드 설정
- 성능 측정 리포트
- Bundle 분석 리포트

**레포팅 내용**:
- 최적화 전/후 성능 비교
- Bundle 크기 비교
- Lighthouse 점수
- Core Web Vitals 지표
- 적용된 최적화 기법 목록

---

### Phase 7: 테스트 및 품질 보증

**목적**: 애플리케이션의 안정성과 품질을 보장

**작업 항목**:

1. **단위 테스트**
   - Vitest 설정
   - 유틸리티 함수 테스트
   - 커스텀 훅 테스트 (React Testing Library)
```bash
   npm install -D vitest @testing-library/react @testing-library/jest-dom
```

2. **통합 테스트**
   - 컴포넌트 테스트
   - API 통신 모킹 (MSW)
   - 사용자 시나리오 테스트

3. **E2E 테스트** (선택적)
   - Playwright 또는 Cypress 설정
   - 주요 사용자 플로우 테스트

4. **코드 품질 검사**
   - ESLint 설정 및 실행
   - Prettier 설정
   - 타입 체크 (TypeScript 사용 시)

**산출물**:
- 테스트 코드
- 테스트 커버리지 리포트
- 코드 품질 리포트

**레포팅 내용**:
- 테스트 커버리지 현황
- 발견된 버그 및 수정 내역
- 코드 품질 점수

---

## 각 단계 진행 프로세스

각 Phase를 진행할 때 다음 순서를 따릅니다:

1. **단계 시작 선언**
   - 현재 진행할 Phase 번호와 제목 명시
   - 이 단계의 목적 설명

2. **작업 수행**
   - 해당 Phase의 작업 항목 수행
   - 필요한 코드 작성 또는 파일 생성
   - 진행 중 발생하는 이슈나 결정사항 기록

3. **레포팅**
   - 수행한 작업 요약
   - 생성된 파일 목록
   - 주요 결정사항 및 이유
   - 다음 단계 진행을 위한 확인사항

4. **승인 대기**
   - 사용자에게 명확하게 승인 요청
   - "다음 단계로 진행하시겠습니까?" 질문
   - 사용자가 수정 요청 시 반영 후 재검토

5. **다음 단계 진행**
   - 승인 후 다음 Phase로 이동

---

## 보안 체크리스트

각 단계에서 다음 보안 사항을 확인합니다:

- [ ] 민감한 정보가 코드에 하드코딩되지 않았는가?
- [ ] 환경 변수가 적절히 관리되고 있는가?
- [ ] 사용자 입력이 적절히 검증되고 있는가?
- [ ] XSS 공격에 대한 방어가 되어 있는가?
- [ ] CSRF 토큰이 올바르게 처리되고 있는가?
- [ ] 인증 토큰이 안전하게 저장되고 있는가?
- [ ] HTTPS 통신이 적용되어 있는가?
- [ ] 의존성 패키지에 보안 취약점이 없는가?
- [ ] 에러 메시지가 민감한 정보를 노출하지 않는가?
- [ ] 권한 검증이 클라이언트와 서버 양쪽에서 이루어지는가?

---

## 최적화 체크리스트

각 단계에서 다음 최적화 사항을 확인합니다:

### 렌더링 최적화
- [ ] React.memo()가 적절히 사용되었는가?
- [ ] useMemo(), useCallback()이 필요한 곳에 사용되었는가?
- [ ] 리스트 렌더링 시 적절한 key가 사용되었는가?

### 상태 관리
- [ ] 상태가 적절하게 분리되어 있는가?
- [ ] 불필요한 전역 상태가 없는가?
- [ ] Context가 과도하게 사용되지 않았는가?

### 코드 스플리팅
- [ ] 라우트 기반 코드 스플리팅이 적용되었는가?
- [ ] 큰 컴포넌트나 라이브러리가 레이지 로드되는가?

### 네트워크
- [ ] API 응답이 캐싱되고 있는가?
- [ ] 불필요한 중복 요청이 없는가?
- [ ] Debounce/Throttle이 적절히 사용되었는가?

### 빌드
- [ ] Bundle 크기가 적정한가?
- [ ] Tree shaking이 동작하는가?
- [ ] 불필요한 의존성이 제거되었는가?

---

## 참고 자료

### 기술 스택 문서
- [React 공식 문서](https://react.dev/)
- [Vite 공식 문서](https://vitejs.dev/)
- [Axios 문서](https://axios-http.com/)
- [React Router 문서](https://reactrouter.com/)
- [Zustand 문서](https://zustand-demo.pmnd.rs/)

### 보안
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React 보안 가이드](https://react.dev/learn/keeping-components-pure)

### 최적화
- [Web.dev Performance](https://web.dev/learn/performance/)
- [React 성능 최적화](https://react.dev/learn/render-and-commit)

---

## 프로젝트 시작 예시

사용자가 "DRF 백엔드가 있는데, React로 프론트엔드 개발해줘"라고 요청하면:

1. Phase 1부터 시작
2. 백엔드 API 정보 요청 (엔드포인트 목록, 인증 방식 등)
3. 요구사항 도출 및 정리
4. 레포팅 후 승인 요청
5. 승인 받으면 Phase 2로 진행
6. 모든 Phase를 순차적으로 완료

---

## 주의사항

1. **절대 단계를 건너뛰지 않습니다**: 각 Phase는 순차적으로 진행되어야 합니다.
2. **사용자 승인 없이 다음 단계로 진행하지 않습니다**: 각 단계 완료 후 반드시 사용자의 확인을 받습니다.
3. **보안은 타협하지 않습니다**: 어떤 상황에서도 보안 관련 단계는 생략하지 않습니다.
4. **문서화를 소홀히 하지 않습니다**: 모든 결정사항과 작업 내역을 명확히 기록합니다.
5. **코드 품질을 유지합니다**: 빠른 개발보다 유지보수 가능한 코드 작성을 우선시합니다.

---

## 디렉토리 구조 예시
```
project-root/
├── .env                      # 환경 변수 (Git 제외)
├── .env.example              # 환경 변수 템플릿
├── .eslintrc.js              # ESLint 설정
├── .gitignore
├── .prettierrc               # Prettier 설정
├── index.html
├── package.json
├── vite.config.js            # Vite 설정
├── README.md
├── public/                   # 정적 파일
│   └── assets/
└── src/
    ├── api/                  # API 관련
    │   ├── client.js         # Axios 인스턴스
    │   ├── endpoints.js      # 엔드포인트 정의
    │   ├── interceptors.js   # 요청/응답 인터셉터
    │   └── services/         # API 서비스
    │       ├── authService.js
    │       ├── userService.js
    │       └── ...
    ├── components/           # 컴포넌트
    │   ├── common/           # 공통 컴포넌트
    │   │   ├── Button/
    │   │   ├── Input/
    │   │   ├── Modal/
    │   │   └── ...
    │   └── features/         # 기능별 컴포넌트
    │       ├── auth/
    │       ├── user/
    │       └── ...
    ├── config/               # 설정
    │   ├── constants.js      # 상수
    │   └── config.js         # 앱 설정
    ├── contexts/             # React Context
    │   ├── AuthContext.jsx
    │   └── ThemeContext.jsx
    ├── hooks/                # 커스텀 훅
    │   ├── useAuth.js
    │   ├── useApi.js
    │   └── ...
    ├── layouts/              # 레이아웃
    │   ├── MainLayout.jsx
    │   ├── AuthLayout.jsx
    │   └── ...
    ├── pages/                # 페이지
    │   ├── Home/
    │   ├── Login/
    │   ├── Dashboard/
    │   └── ...
    ├── routes/               # 라우팅
    │   ├── index.jsx         # 라우트 정의
    │   ├── PrivateRoute.jsx  # 보호된 라우트
    │   └── routes.js         # 라우트 상수
    ├── store/                # 상태 관리
    │   ├── index.js
    │   ├── authStore.js
    │   └── ...
    ├── styles/               # 스타일
    │   ├── global.css
    │   ├── variables.css
    │   └── themes/
    ├── utils/                # 유틸리티
    │   ├── validation.js
    │   ├── formatters.js
    │   ├── errorHandling.js
    │   └── ...
    ├── App.jsx
    └── main.jsx
```

---

## 버전 히스토리

### v1.0.0 (2025-10-23)
- 초기 스킬 생성
- DRF-React 개발 프로세스 8단계 정의
- 보안 및 최적화 가이드라인 포함
- 단계별 승인 프로세스 구현