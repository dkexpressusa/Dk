# DK Express 웹사이트 재구축

## 1. 프로젝트 설명
뉴욕 플러싱에서 10년 이상 운영 중인 한국-미국 국제 택배 서비스 DK Express의 공식 웹사이트.
CJ택배, FedEx, DHL과 제휴하여 뉴욕에서 한국으로 안전하고 빠른 배송 서비스를 제공.

## 2. 페이지 구조
- `/` - 메인 홈페이지
- `/shipping` - 한국 일반 택배
- `/moving` - 귀국 이사
- `/how-to-use` - 이용방법
- `/tracking` - 배송조회
- `/faq` - FAQ
- `/contact` - 문의하기
- `/reviews` - 이용후기
- `/admin` - 관리자 로그인
- `/admin/dashboard` - 관리자 대시보드 (문의 관리)

## 3. 핵심 기능
- [x] 히어로 섹션 (브랜드 소개)
- [x] 서비스 소개 (CJ택배, FedEx, DHL)
- [x] 배송 절차 및 소요 시간
- [x] 고객 지원 / 통계
- [x] 이용 후기
- [x] 회사 소개 및 연락처
- [x] 문의 폼 (Supabase DB 저장)
- [x] 관리자 로그인 (Supabase Auth)
- [x] 관리자 대시보드 (문의 목록 조회/상태 관리)
- [ ] 고객 리뷰 관리 (Supabase)
- [ ] 배송 조회 실제 연동

## 4. 데이터 모델
### Table: contacts
| 필드 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| name | text | 이름 |
| phone | text | 전화번호 (선택) |
| email | text | 이메일 |
| service | text | 서비스 종류 |
| width | numeric | 가로 (선택) |
| height | numeric | 세로 (선택) |
| depth | numeric | 높이 (선택) |
| weight | numeric | 무게 (선택) |
| message | text | 문의 내용 |
| status | text | new / in_progress / done |
| created_at | timestamptz | 접수일시 |

## 5. 백엔드 / 서드파티 연동
- Supabase: ✅ 연결됨 — Auth(관리자 로그인), DB(문의 저장/조회), RLS 설정 완료
- Shopify: 불필요
- Stripe: 불필요

## 6. 개발 단계
### Phase 1: 홈페이지 전체 구축 ✅
- 목표: 단일 페이지 완성
- 산출물: 완성된 공식 웹사이트

### Phase 2: Supabase 연동 ✅
- 목표: 문의 폼 DB 저장 + 관리자 페이지
- 산출물: contacts 테이블, 관리자 로그인/대시보드

### Phase 3: 리뷰 관리 (예정)
- 목표: 고객 리뷰를 Supabase에서 직접 관리
- 산출물: reviews 테이블, 관리자 리뷰 관리 기능
