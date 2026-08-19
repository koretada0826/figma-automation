# 05. データ可視化 — グラフ/チャートのデザイン教科書

コード生成ツールがダッシュボードやレポートのチャートを生成する際に参照する規範集。公開の正規ソース（IBM Carbon / Datawrapper / Material / Tufte の原則）を蒸留した。各節に出典を併記する。

---

## 1. チャートの選び方（意図から形を決める）

チャートは「見た目の好み」ではなく **読者に何をさせたいか（比較・推移・構成比・相関・分布・位置）** から選ぶ。まず問いを一文にし、それに対応する形を選ぶ。

| 意図（読者にさせたいこと） | 第一候補 | 補足 |
|---|---|---|
| **比較**（AとBどちらが大きいか） | 横棒 / 縦棒 | 人間の目は「長さ」の比較が最も正確 |
| **推移**（時間に沿った変化） | 折れ線 / エリア | 連続的な時間には点をつなぐ折れ線 |
| **構成比**（全体に占める割合） | 積み上げ棒 / ドーナツ / 円 | 分類が少なく合計=100%が主題のとき |
| **相関**（2変数の関係） | 散布図 | 3変数目は点のサイズ/色で（バブル） |
| **分布**（値の散らばり） | ヒストグラム / 箱ひげ | 単一変数の頻度 |
| **順位** | ソート済み横棒 | ラベルが長いときは横棒が読みやすい |
| **単一の重要数値** | KPI/数値カード | 文脈（前期比）を必ず添える |

判断の順序：**「値の差を精密に比べさせたい」なら棒**、**「全体に対する大まかな割合を感じさせたい」なら円/ドーナツ**。この2つは目的が違うので混同しない。

**円グラフの注意**：円/ドーナツは各スライスの「角度・面積」を比較させるため、長さより精度が落ちる。Datawrapper は次を推奨する。

- スライスは **5個まで**。それ以上は積み上げ棒/横棒に切り替える。
- スライス同士の **差が小さいと円では判別不能**（棒なら3%差も見えるが、円ではほぼ見えない）。差の比較が主題なら棒を使う。
- 円は **25% / 50% / 75% 付近の値** を直感的に読ませたいときに強い。
- 3D円、爆発（切り離し）演出、多数の細スライスは避ける。

出典:
- [Datawrapper: A friendly guide to choosing a chart type](https://www.datawrapper.de/blog/chart-types-guide)
- [Datawrapper: What to consider when creating pie charts](https://www.datawrapper.de/blog/pie-charts)
- [IBM Design Language – Charts](https://www.ibm.com/design/language/data-visualization/charts/)

---

## 2. ドーナツ/円グラフの正しい作り方

### 2.1 設計ルール

- **分類は3〜5まで**。「その他」でまとめて末尾に置く。
- スライスは **大きい順に時計回り**（12時＝0°起点）で並べる。最大スライスを12時から時計回りに置くと読みやすい。
- **色は隣接スライスのコントラストを最大化**（カテゴリカル配色、後述）。1つを強調したいなら強調色1つ＋残りをグレーにする。
- **凡例よりも直接ラベル**（スライスの外側/内側に「ラベル 42%」）が理想。凡例に頼ると視線移動が増える。
- ドーナツの **中央の空白は貴重な余白**。合計値・総数・単位、または強調したい1スライスの値を置く（Datawrapper 推奨）。
- 相対値を入れたなら中央合計は 100% になるはず。絶対値なら「合計 1,240 件」のように総数＋単位を出す。

### 2.2 セグメントの角度計算

各カテゴリ値 `vᵢ`、合計 `T = Σvᵢ` に対し、スライスの角度（ラジアン）は：

```
sweepᵢ = 2π * (vᵢ / T)          // このスライスが占める角の大きさ
startᵢ = Σ_{k<i} sweep_k          // 直前までの累積が開始角
endᵢ   = startᵢ + sweepᵢ
```

12時起点・時計回りにするには、角度に `-90°`（=`-π/2`）のオフセットを足す。

出典:
- [Datawrapper Academy: Customizing your donut chart](https://academy.datawrapper.de/article/49-customizing-your-donut-chart)
- [Datawrapper: Our deliciously new pies & donuts](https://www.datawrapper.de/blog/better-piecharts)

---

## 3. SVGで弧(arc)を描く — 数式と擬似コード（実装用）

### 3.1 円周上の点（polar → cartesian）

中心 `(cx, cy)`、半径 `r`、角度 `deg`（度）に対する円周上の点：

```js
function polarToCartesian(cx, cy, r, angleDeg) {
  // SVGはY軸が下向き。0°を12時にするため -90 する
  const a = (angleDeg - 90) * Math.PI / 180;
  return {
    x: cx + r * Math.cos(a),
    y: cy + r * Math.sin(a),
  };
}
```

### 3.2 SVG の A（arc）コマンド

```
A rx ry xAxisRotation largeArcFlag sweepFlag endX endY
```

- `rx ry` … 楕円の半径（円なら両方 `r`）
- `xAxisRotation` … 楕円の回転（円なら `0`）
- `largeArcFlag` … 弧が180°を超えるなら `1`、以下なら `0`
- `sweepFlag` … 描画方向。時計回り＝`1`、反時計回り＝`0`
- `endX endY` … 弧の終点

`largeArcFlag` と `sweepFlag` は、同じ2点を結ぶ4通りの弧を一意に選ぶための曖昧さ解消フラグ（[understand-svg-arcs](https://github.com/waldyrious/understand-svg-arcs)）。

### 3.3 円弧のパス生成（線グラフ用/ゲージ用）

```js
function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end   = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = (endAngle - startAngle) % 360 <= 180 ? 0 : 1;
  // 時計回りに描くので sweepFlag = 0（この start→end の取り方に合わせる）
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}
```

### 3.4 ドーナツのセグメント（塗りつぶしの環状扇形）

内半径 `ri`・外半径 `ro` の環状扇形は「外周を時計回り → 内周を反時計回り → Z で閉じる」：

```js
function donutSegment(cx, cy, ri, ro, startAngle, endAngle) {
  const oS = polarToCartesian(cx, cy, ro, startAngle);
  const oE = polarToCartesian(cx, cy, ro, endAngle);
  const iE = polarToCartesian(cx, cy, ri, endAngle);
  const iS = polarToCartesian(cx, cy, ri, startAngle);
  const large = (endAngle - startAngle) % 360 <= 180 ? 0 : 1;
  return [
    `M ${oS.x} ${oS.y}`,
    `A ${ro} ${ro} 0 ${large} 1 ${oE.x} ${oE.y}`, // 外周（時計回り sweep=1）
    `L ${iE.x} ${iE.y}`,
    `A ${ri} ${ri} 0 ${large} 0 ${iS.x} ${iS.y}`, // 内周（反時計回り sweep=0）
    `Z`,
  ].join(' ');
}
```

角度が 360° ちょうど（=単一カテゴリで全周）だと A コマンドは始点＝終点で描画されないため、その場合は2つの半円弧に分割するか `<circle>` を使う。

出典:
- [Smashing Magazine: Decoding the SVG path Element — Curve & Arc Commands](https://www.smashingmagazine.com/2025/06/decoding-svg-path-element-curve-arc-commands/)
- [D3 d3-shape: Arcs](https://d3js.org/d3-shape/arc)

---

## 4. 折れ線 / スパークラインの作法

### 4.1 折れ線

- **X軸は時間、Y軸は値**。時系列は必ず左→右に古い→新しい。
- **データインク比を最大化**（Tufte）：意味のないインクを消す。重いグリッド、枠線、背景色、影、3D、グラデ塗りは削る。
- グリッド線は **薄いグレーの水平線を数本**に留める。縦グリッドは通常不要。
- 目盛りは間引く（例：主要な区切りだけラベル）。データラベルは端点や極値だけに。
- 線は同時に **4〜5本まで**。多いときは強調線1本＋残りをグレーの「ゴースト線」に。
- 直接ラベル（線の右端に系列名）を凡例より優先。
- 欠損は勝手に補間して線をつながない。ギャップを見せる。

### 4.2 スパークライン

Tufte の定義：**文字サイズの、語に埋め込む小さな線グラフ**。軸・目盛り・凡例を持たず、トレンドだけを一目で伝える。ダッシュボードでは KPI カードの下に置くと効果的。

- 軸ラベルなし。始点/終点の値だけ小さく添えることがある。
- 最終点や最大/最小に **1点だけ色付きドット**で注意を引く。
- 幅は 80〜120px、高さは 20〜40px 程度が目安。

出典:
- [Tufte's Principles of Data-Ink (EDAV)](https://jtr13.github.io/cc19/tuftes-principles-of-data-ink.html)
- [Datawrapper: chart types guide](https://www.datawrapper.de/blog/chart-types-guide)

---

## 5. 棒グラフ

- **Y軸（値軸）は必ず 0 起点**。棒は「長さ」で量を表すため、0以外から始めると差が誇張され、グラフ整合性（graphical integrity）を損なう。折れ線は0起点でなくてよいが棒は必須。
- **色は原則単色**。全部の棒を同じ1色にし、強調したい1本だけ別色にする（他をグレーに）。虹色は情報を持たないノイズ。
- **棒の間隔**：棒幅に対し隙間はおおむね幅の 20〜50%（`gap ≈ barWidth * 0.2〜0.5`）。隙間0だとヒストグラムに見え、広すぎると比較しづらい。
- **並び順に意味を**：カテゴリカルは値でソート（大→小）。時間や順序尺度（曜日・年齢帯）なら自然順を保つ。
- ラベルが長いときは **横棒**にして左揃えで読ませる。
- 積み上げ棒は「合計の推移＋内訳」を同時に見せたいとき。ただしベースが揃うのは一番下の系列だけなので、中間系列の比較は苦手。比較が主題なら **100%積み上げ** かグループ化棒に。

出典:
- [Datawrapper: chart types guide](https://www.datawrapper.de/blog/chart-types-guide)
- [IBM Design Language – Charts](https://www.ibm.com/design/language/data-visualization/charts/)

---

## 6. KPI / 数値カードの見せ方

- **数字ファースト**：主数値を最大・最太で。単位（円 / % / 件）は数値より小さく添える。桁区切りを入れる（`1,240`）。
- **1カード1指標**。詰め込まない。ラベル（指標名）は数値の上か下に小さく。
- **増減は色と符号**：改善＝緑、悪化＝赤、変化なし＝グレー。矢印（▲▼）＋「前期比 +12%」で文脈を与える。**色だけに意味を持たせず**符号や矢印も併用（色覚配慮）。
- 「増加＝良い」が常に真ではない（コスト・離脱率は減少が良い）ため、**色は良し悪しの意味で付ける**（値の増減そのものではなく）。
- スパークラインを添えると「今の値＋そこに至る流れ」を同時に伝えられる。
- 数値のフォーマットは一貫させる（小数桁、丸め、単位表記）。

出典:
- [IBM Design Language – Charts](https://www.ibm.com/design/language/data-visualization/charts/)
- [Datawrapper: chart types guide](https://www.datawrapper.de/blog/chart-types-guide)

---

## 7. カラー

### 7.1 配色の3タイプ（用途で使い分け）

- **カテゴリカル（質的）**：相関のない離散カテゴリの区別に使う。色は「意味の順序」を持たず、隣接色のコントラストが最大になるよう curated された順に割り当てる（IBM Carbon）。国・製品・部門など。
- **連続（シーケンシャル）／モノクロマティック**：単一の量の大小（低→高）を1色相の明度で表す。ヒートマップ、相関/トレンドチャートに。
- **発散（ダイバージング）**：中央（0や平均）から両方向に離れる量（例：予算差異 −/+）。2色相が中央の中間色を挟む。

グラデーションは「範囲内の極値を強調したい」単一カテゴリのみに使い、複数グラデの併用はアクセシビリティを損なうため避ける（Carbon）。

### 7.2 色覚多様性への配慮

- **色だけに情報を載せない**。パターン・直接ラベル・アイコン・位置を併用。線グラフは端点ラベル、棒は並び順で意味を補強。
- **十分なコントラスト**：Carbon はデータ可視化パレットで最低 **3:1〜3.5:1（WCAG）** を確保するよう設計している。
- 赤×緑の隣接など、色覚型で区別困難な組み合わせを避ける。青×オレンジは多くの色覚型で識別しやすい。
- カテゴリ数が増えるほど区別は困難。**7色を超えたら**色以外の手法（グルーピング、小さな複数グラフ＝small multiples）に切り替える。

出典:
- [Carbon Design System: Color palettes](https://carbondesignsystem.com/data-visualization/color-palettes/)
- [Carbon: Color palettes and accessibility features for data visualization (Medium)](https://medium.com/carbondesign/color-palettes-and-accessibility-features-for-data-visualization-7869f4874fca)
- [IBM Design Language – Color](https://www.ibm.com/design/language/color/)

---

## 8. ダッシュボードのレイアウト

- **最重要指標は左上**。西洋型の読み順（左→右、上→下＝Zパターン/F字パターン）で視線が最初に落ちるのは左上。ここに主要KPIや全体サマリを置く。
- **上から下へ抽象→詳細**：上段に総括KPIカード、中段に主要トレンド（折れ線）、下段に内訳（棒・表）。詳細ほど下・右へ。
- **Zパターン**：左上→右上→左下→右下。右上には期間フィルタやアクション、右下に補助情報を置くと自然。
- **視覚的階層**：サイズ・太さ・色で重要度を表す。全部を目立たせると何も目立たない。
- **グリッドで整列**：カードを共通グリッド（例：12カラム）に載せ、余白（ガター）を一定に。整列と一定の間隔が「読みやすさ」を生む。
- **密度**：1画面に詰め込みすぎない。1ダッシュボード＝1つの問いに答える。関連指標をグルーピングし、グループ間に十分な余白を取る。
- **一貫性**：同じ指標には同じ色・同じ単位・同じ時間範囲。系列色はダッシュボード全体で固定する。
- **相互作用の順序**：フィルタ→全体像→ドリルダウン、の流れを崩さない。

出典:
- [IBM Design Language – Data visualization](https://www.ibm.com/design/language/data-visualization/charts/)
- [Datawrapper: chart types guide](https://www.datawrapper.de/blog/chart-types-guide)

---

## 9. チェックリスト（生成前の最終確認）

1. その問い（比較/推移/構成比/相関/分布）に**チャート種別が合致**しているか。
2. 棒は **0起点**か。円/ドーナツは **5分類以下**か。
3. インクの無駄（3D・影・重グリッド・不要枠）を**削った**か（データインク比）。
4. 色は **カテゴリカル/連続/発散** の用途に合っているか。**色だけに依存**していないか、コントラストは足りるか。
5. 凡例より **直接ラベル**を優先したか。
6. KPIカードに **単位・前期比・良し悪しの色**があるか。
7. 最重要指標が **左上**にあり、視覚的階層が明確か。
8. SVG弧は **12時起点・角度計算・largeArc/sweepフラグ**が正しいか。360°ケースを処理したか。

---

### 参照ソース一覧
- IBM Carbon Design System — Color palettes: https://carbondesignsystem.com/data-visualization/color-palettes/
- IBM Carbon — accessibility features (Medium): https://medium.com/carbondesign/color-palettes-and-accessibility-features-for-data-visualization-7869f4874fca
- IBM Design Language — Charts: https://www.ibm.com/design/language/data-visualization/charts/
- IBM Design Language — Color: https://www.ibm.com/design/language/color/
- Datawrapper — Choosing a chart type: https://www.datawrapper.de/blog/chart-types-guide
- Datawrapper — Pie charts: https://www.datawrapper.de/blog/pie-charts
- Datawrapper — Pies & donuts: https://www.datawrapper.de/blog/better-piecharts
- Datawrapper Academy — Donut chart: https://academy.datawrapper.de/article/49-customizing-your-donut-chart
- Tufte's Principles of Data-Ink (EDAV): https://jtr13.github.io/cc19/tuftes-principles-of-data-ink.html
- Smashing Magazine — SVG path curve & arc commands: https://www.smashingmagazine.com/2025/06/decoding-svg-path-element-curve-arc-commands/
- D3 d3-shape — Arcs: https://d3js.org/d3-shape/arc
- understand-svg-arcs (GitHub): https://github.com/waldyrious/understand-svg-arcs
