# PHM in Practice 웹사이트

사이트 주소: https://phm-in-practice.github.io

## 파일 구성

| 파일 | 내용 | 직접 수정 |
|---|---|---|
| `index.md`, `examples.md`, `about.md` | 한글 홈, PHM Examples, About Us | O |
| `en/index.md`, `en/examples.md`, `en/about.md` | 영문 홈, PHM Examples, About Us | O |
| `cases/` | 구현사례 HTML 파일 | 파일 올리기만 |
| `_layouts/`, `assets/`, `_config.yml` | 메뉴·디자인 틀 | X (손대지 않음) |

## 글 고치는 방법

1. 고칠 `.md` 파일을 누르고 오른쪽 위 연필(✏️) 아이콘을 누릅니다.
2. 글을 고친 뒤 오른쪽 위 **Commit changes…** → 다시 **Commit changes**를 누릅니다.
3. 1~2분 뒤 사이트에 반영됩니다.

맨 위 `---`와 `---` 사이의 설정 부분은 `title`(배너 제목), `subtitle`(배너 소제목) 글자만 고칩니다.

## 마크다운 기본 문법

- 문단: 문단 사이에 빈 줄 하나
- 링크: `[보이는 글자](주소)`
- 사례 제목(구분선이 있는 굵은 제목): 줄 맨 앞에 `## `
- 굵게: `**글자**`

## 새 구현사례 추가하기

1. `cases` 폴더에 들어가 **Add file → Upload files**로 사례 HTML 파일(한글·영문)을 끌어다 놓고 Commit합니다.
2. `examples.md`(한글)와 `en/examples.md`(영문) 맨 아래에 다음 형식으로 추가합니다.

```markdown
## [사례 제목](/cases/파일이름.html)

사례 설명 문단
```
