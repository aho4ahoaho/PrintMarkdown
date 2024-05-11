# テスト用 markdown

## ヘッダーのテスト

# H1

## H2

### H3

#### H4

##### H5

###### H6

## パラグラフ

パラグラフ
改行してパラグラフ

1 行開けてパラグラフ

## リスト

- リスト
  - ネストリスト
    - ネストリスト
      - ネストリスト

## 添字

### 上付き文字

- x^2^

### 下付き文字

- y~2~

## 数式

### インライン数式

$ Q(s,a)\leftarrow Q(s,a)+\alpha \Delta Q $

### ブロック数式

$$
  \Delta Q = r_{t+1}+\gamma \max_{a'}Q(s',a')-Q(s,a)\\ \tag{1}
  Q(s,a)\leftarrow Q(s,a)+\alpha \Delta Q
$$

## チェックボックス

- [x] チェック済み
- [ ] 未チェック

## テーブル

| Header1 | Header2 | Header3 |
| ------- | ------- | :-----: |
| Data1   | Data2   |  Data3  |
| Data4   | Data5   |  Data6  |
| Data7   | Data8   |  Data9  |

## リンク

- [Google](https://www.google.com)
- [Yahoo](https://www.yahoo.co.jp)

## 画像

![Image](https://www.naoki-workspace.net/_astro/logo.XyeQG64k_Z2asCW3.webp)

## メッセージボックス

::: info
情報メッセージ
:::
::: warn
警告メッセージ
:::
::: alert
より強い警告メッセージ
:::

## 区切り線

---

## 注釈

本文中で注釈を使うことができます[^1]。複数の注釈も使えます[^2]。

[^1]: 注釈のテスト
[^2]: 2 番目の注釈
