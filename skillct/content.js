/* =============================================================================
 * SkillCT 项目主页 — 你平时只需要改这一个文件。
 *
 * 改完保存，刷新浏览器即可。不用改 index.html 或 css。
 *
 * 1. 改标题、作者、摘要、按钮链接
 *    直接改下面的文字。投稿期间不要在页面上写会议名称。
 *    按钮的 href 留空 "" 会显示成 “coming soon”，填上链接就会变成可点击按钮。
 *
 * 2. 加一张图片（论文图、实验图都可以）
 *    - 把图片放进 homepage/images/，例如 homepage/images/fig1-overview.png
 *    - 在 method.figures 或 results.figures 里把对应的 src 写成 "images/fig1-overview.png"
 *    - caption 是图片下面的说明
 *    - 想再加一张：复制一段 { src, alt, caption }，粘到数组末尾
 *
 * 3. 加一组实验结果
 *    - 在 results.tabs 末尾追加一个对象：id、label、intro、table
 *    - table.columns 是表头，table.rows 每一行是一个数组，列数要和表头一致
 *    - 页面上会多出一个可切换的标签
 *
 * 4. 加入你自己做的网页
 *    - 把网页文件放进 homepage/my-page/（入口文件保持 index.html），或
 *    - 把 pages 里的 href 改成完整网址，例如 "https://your-page.github.io/"
 *    - embed: true 会嵌在主页里；false 只显示“新窗口打开”
 *    - 想再挂一个网页：把 pages 里的对象再复制一份
 *
 * 5. 本地预览
 *    在 homepage 目录运行：  python3 -m http.server 8765
 *    然后打开 http://127.0.0.1:8765/
 * ============================================================================= */

window.SITE = {
  meta: {
    title: "SkillCT: An Execution-Free Benchmark for Multidimensional Agent Skill Assessment",
    description:
      "SkillCT scores 4,098 reference skills on nine quality dimensions and estimates the same profile for 3,050 further skills without executing them.",
  },

  /* 顶栏。href 对应页面里的区块 id，一般不用改。想改显示文字，改 label。 */
  nav: [
    { label: "Overview", href: "#overview" },
    { label: "Method", href: "#method" },
    { label: "Demo", href: "#demo" },
    { label: "Benchmark", href: "#benchmark" },
    { label: "Results", href: "#results" },
    { label: "Resources", href: "#resources" },
  ],

  hero: {
    brand: "SkillCT",
    title: "SkillCT: An Execution-Free Benchmark for Multidimensional Agent Skill Assessment",
    subtitle: "",
    badges: [
      { text: "Execution-free", emphasis: true },
      { text: "4,098", strong: "reference skills" },
      { text: "9", strong: "quality dimensions" },
    ],
    /* href 为空就显示 coming soon。paper 已指向本目录里的 PDF。 */
    buttons: [
      { label: "Paper", icon: "doc", href: "paper/SkillCT.pdf" },
      { label: "Code", icon: "code", href: "" },
      { label: "arXiv", icon: "arxiv", href: "" },
    ],
  },

  authors: [
    { name: "Mengyu Sun" },
    { name: "Zunlong Zhou" },
    { name: "Ziyuan Yang" },
    { name: "Yi Zhang" },
  ],
  affiliation: "Sichuan University",

  logos: [
    { src: "images/scu-logo.png", alt: "Sichuan University" },
  ],

  overview: {
    title: "Why This Matters",
    paragraphs: [
      "Agent skills are modular packages of instructions, scripts, and resources that guide agents through specialized tasks. Existing benchmarks mostly ask whether a skill improves a downstream task.",
      "That is useful, but it says little about specification quality, behavioral stability, semantic alignment, or whether the skill's responsibility is scoped well. It also depends on task-specific tools, environments, and repeated executions, which makes pre-deployment assessment hard to scale.",
      "**SkillCT** scores each reference skill on nine complementary dimensions, then estimates the same profile for a new skill by retrieving already-assessed reference skills, without executing the new skill.",
    ],
    contributionsTitle: "Core Contributions",
    contributions: [
      "The SkillCT reference benchmark: 4,098 public agent skills across 14 categories, each with a nine-dimensional quality profile, plus an independent evaluation set of 3,050 skills.",
      "An execution-free baseline that estimates a new skill's quality profile from the reference benchmark, without executing the skill.",
      "Evidence that raising SkillCT scores improves downstream task success while cutting execution steps and output tokens.",
    ],
  },

  method: {
    title: "Three Assessment Aspects",
    lede: "Every skill receives one profile. Static scores come from the specification alone. Dynamic scores come from controlled behavior. Human-assisted scores cover judgments that task success does not reveal.",
    cards: [
      {
        title: "Static Assessment",
        body: "Structural completeness, conciseness, and description-content consistency. Deterministic rules and text statistics, so the same skill gets the same score on repeat.",
      },
      {
        title: "Dynamic Assessment",
        body: "Cross-model robustness, intent-perturbation stability, capability-boundary handling, and efficiency, measured on execution traces from multiple backbone models.",
      },
      {
        title: "Human-Assisted Assessment",
        body: "Behavior-chain semantic consistency and task abstraction granularity: whether actions serve the stated goal, and whether the skill is a coherent unit of work.",
      },
    ],
    /* 论文图。架构图只放一张，页面上不出现切换按钮。 */
    figures: [
      {
        src: "images/framework.png?v=20261027",
        alt: "SkillCT assessment framework",
        caption:
          "Figure 1. SkillCT overview. Public skills are scored on nine dimensions. The reference benchmark contains 4,098 skills, and the evaluation set contains 3,050 skills.",
      },
    ],
    baseline: {
      kicker: "Baseline",
      title: "Execution-Free Assessment Baseline",
      lede: "The complete SkillCT assessment produces multidimensional quality profiles. Repeating it for every newly introduced skill requires additional model executions and annotation. To avoid that cost, the baseline reuses existing assessment profiles and does not repeat behavioral evaluation of the target skill.",
      steps: [
        {
          title: "Reference Retrieval",
          body: "Retrieval identifies reference skills whose specifications are relevant to the target skill. The name, description, and instructional content are concatenated and represented with TF-IDF, then ranked by cosine similarity. The top 8 are retained in all experiments. Retrieval uses only the reference benchmark; assessment targets do not enter it.",
        },
        {
          title: "Quality Profile Estimation",
          body: "The three Static Assessment scores are computed directly from the target skill's specification. The other six dimensions are estimated by cosine similarity-weighted aggregation of the retrieved quality profiles. The resulting profile is obtained without executing the target skill, and is comparable with a profile from the full SkillCT assessment.",
        },
      ],
    },
  },

  benchmark: {
    kicker: "Benchmark",
    title: "SkillCT Benchmark",
    lede: "The reference benchmark pairs 4,098 public agent skills, collected from SkillHub, ClawHub, and GitHub, with nine-dimensional quality profiles across 14 categories. An independent evaluation set of 3,050 skills is used only as assessment targets for the execution-free baseline and is excluded from retrieval.",
    stats: [
      { value: "4,098", label: "Reference skills" },
      { value: "3,050", label: "Evaluation skills" },
      { value: "9", label: "Quality dimensions" },
      { value: "14", label: "Task categories" },
    ],
    dimensionsTitle: "Nine dimensions",
    dimensions: [
      { group: "Static Assessment", name: "Structural Completeness" },
      { group: "Static Assessment", name: "Conciseness" },
      { group: "Static Assessment", name: "Description-Content Consistency" },
      { group: "Dynamic Assessment", name: "Cross-Model Robustness" },
      { group: "Dynamic Assessment", name: "Intent-Perturbation Stability" },
      { group: "Dynamic Assessment", name: "Capability-Boundary Handling" },
      { group: "Dynamic Assessment", name: "Efficiency" },
      { group: "Human-Assisted Assessment", name: "Behavior-Chain Semantic Consistency" },
      { group: "Human-Assisted Assessment", name: "Task Abstraction Granularity" },
    ],
    categoriesTitle: "14 task categories",
    categories: [
      "Finance",
      "Communication",
      "Knowledge",
      "Productivity",
      "Creative",
      "Development",
      "Agents",
      "Automation",
      "Lifestyle",
      "Security",
      "Operations",
      "Research",
      "Integrations",
      "Other",
    ],
  },

  results: {
    title: "Key Results",
    lede: "Specification quality, behavioral stability, and task scope do not move together. The execution-free baseline tracks the full assessment, and raising SkillCT scores improves downstream execution.",
    highlights: [
      { value: "0.787", label: "Mean overall score on the reference benchmark" },
      { value: "89.6 → 96.0", label: "Task success (%) after SkillCT-guided revision" },
      { value: "0.53–0.63", label: "Holdout Pearson r of the execution-free baseline" },
    ],
    /* 每个对象是一个结果标签。复制最后一个，改 id / label / table，就能加一组新结果。 */
    tabs: [
      {
        id: "distribution",
        label: "Score distribution",
        intro:
          "On the reference benchmark, the mean overall score is 0.787. Structural completeness and conciseness are strong, while description-content consistency is much weaker (mean 0.560, and 26.2% of skills score below 0.5). Cross-model robustness and intent-perturbation stability (0.769 and 0.808) sit below capability-boundary handling and efficiency (0.875 and 0.811).",
        table: {
          caption: "Table 1. Distributional statistics of SkillCT scores.",
          columns: ["Dimension", "Mean", "Std.", "P50", "≥ 0.8 (%)", "< 0.5 (%)"],
          rows: [
            ["Overall score", "0.787", "0.076", "0.792", "48.5", "0.5"],
            ["Structural Completeness", "0.780", "0.137", "0.800", "53.7", "2.1"],
            ["Conciseness", "0.874", "0.047", "0.885", "93.4", "0.0"],
            ["Description-Content Consistency", "0.560", "0.115", "0.568", "1.7", "26.2"],
            ["Cross-Model Robustness", "0.769", "0.055", "0.775", "16.9", "0.0"],
            ["Intent-Perturbation Stability", "0.808", "0.067", "0.792", "43.3", "0.0"],
            ["Capability-Boundary Handling", "0.875", "0.213", "1.000", "74.1", "0.0"],
            ["Efficiency", "0.811", "0.186", "0.889", "69.9", "0.0"],
            ["Behavior-Chain Semantic Consistency", "0.898", "0.163", "1.000", "80.3", "0.9"],
            ["Task Abstraction Granularity", "0.705", "0.192", "0.850", "55.2", "6.7"],
          ],
          note: "P50 is the median. ≥ 0.8 and < 0.5 are percentages of skills. Full percentiles are in the paper.",
        },
      },
      {
        id: "agreement",
        label: "Human vs. automatic",
        intro:
          "On 140 skills (10 from each category, three annotators), execution-free scores stay close to full SkillCT. Human ratings diverge more: annotators score description-content consistency much higher, and capability-boundary handling much lower.",
        table: {
          caption:
            "Table 2. Human assessment, execution-free SkillCT, and full SkillCT on the same 140 skills.",
          columns: ["Dimension", "Human", "Execution-free", "Full"],
          rows: [
            ["Structural Completeness", "0.814", "0.806", "0.806"],
            ["Conciseness", "0.751", "0.859", "0.859"],
            ["Description-Content Consistency", "0.919", "0.567", "0.567"],
            ["Cross-Model Robustness", "0.848", "0.761", "0.730"],
            ["Intent-Perturbation Stability", "0.826", "0.819", "0.841"],
            ["Capability-Boundary Handling", "0.554", "0.964", "0.916"],
            ["Efficiency", "0.885", "0.908", "0.881"],
            ["Behavior-Chain Semantic Consistency", "0.874", "0.920", "0.922"],
            ["Task Abstraction Granularity", "0.713", "0.661", "0.653"],
          ],
          note: "",
        },
      },
      {
        id: "optimization",
        label: "Skill optimization",
        intro:
          "Revising 700 skills (50 from each category) to raise the overall SkillCT score improves structural completeness and description-content consistency the most. Downstream, task success rises and both steps and output tokens fall. Input tokens rise slightly, so the gain is not from simply shortening the skill.",
        table: {
          caption: "Table 3. SkillCT scores and task execution before and after optimization.",
          columns: ["Measure", "Original", "SkillOpt"],
          rows: [
            ["Structural Completeness", "0.813", "0.904"],
            ["Conciseness", "0.857", "0.864"],
            ["Description-Content Consistency", "0.564", "0.730"],
            ["Cross-Model Robustness", "0.760", "0.799"],
            ["Intent-Perturbation Stability", "0.816", "0.827"],
            ["Capability-Boundary Handling", "0.961", "0.981"],
            ["Efficiency", "0.909", "0.923"],
            ["Behavior-Chain Semantic Consistency", "0.919", "0.929"],
            ["Task Abstraction Granularity", "0.658", "0.703"],
            ["Overall SkillCT", "0.806", "0.851"],
            ["Task success, average (%)", "89.6", "96.0"],
            ["Execution steps, average", "7.85", "6.26"],
            ["Input tokens, average", "1390", "1452"],
            ["Output tokens, average", "867", "760"],
          ],
          note: "Execution averages pool GLM-4.5-Air and DeepSeek-V4-Flash. GLM-4.5-Air success moves from 91.9% to 96.9%; DeepSeek-V4-Flash from 87.3% to 95.1%.",
        },
      },
      {
        id: "holdout",
        label: "Holdout check",
        intro:
          "The reference benchmark is split into 3,278 references and 820 held-out skills. Estimated profiles track the full assessment, with positive correlations and near-zero bias.",
        table: {
          caption: "Table 5. Holdout validation of execution-free SkillCT.",
          columns: ["Dimension", "MAE", "RMSE", "Bias", "Pearson r", "Spearman ρ"],
          rows: [
            ["Cross-Model Robustness", "0.161", "0.227", "0.001", "0.581", "0.465"],
            ["Intent-Perturbation Stability", "0.185", "0.253", "−0.007", "0.625", "0.596"],
            ["Capability-Boundary Handling", "0.113", "0.172", "−0.006", "0.585", "0.541"],
            ["Efficiency", "0.110", "0.150", "0.001", "0.589", "0.541"],
            ["Behavior-Chain Semantic Consistency", "0.095", "0.141", "0.014", "0.570", "0.514"],
            ["Task Abstraction Granularity", "0.128", "0.171", "0.006", "0.525", "0.482"],
          ],
          note: "Static dimensions are computed directly, so they are not predicted in this table.",
        },
      },
      {
        id: "consistency",
        label: "Across LLMs",
        intro:
          "Dimensions that call an LLM judge stay in a narrow band across five models. Overall scores range from 0.759 to 0.769. Structural completeness (0.780), conciseness (0.874), and description-content consistency (0.560) are identical across these models. Cross-model robustness shifts slightly because each row rotates the four-model panel.",
        table: {
          caption: "Table 4. Assessment consistency across LLMs on the reference benchmark.",
          columns: ["Model", "Robust", "IPS", "Boundary", "Efficiency", "Behavior", "Granularity", "Overall"],
          rows: [
            ["Seed-1.6-Flash", "0.672", "0.701", "0.875", "0.811", "0.898", "0.705", "0.764"],
            ["GLM-4.5-Air", "0.680", "0.701", "0.878", "0.814", "0.892", "0.712", "0.766"],
            ["Qwen3.5-Flash", "0.674", "0.717", "0.883", "0.819", "0.902", "0.712", "0.769"],
            ["DeepSeek-V4-Flash", "0.666", "0.693", "0.865", "0.801", "0.895", "0.701", "0.759"],
            ["GPT-5", "0.684", "0.714", "0.869", "0.806", "0.917", "0.706", "0.768"],
          ],
          note: "Robust is cross-model robustness. IPS is intent-perturbation stability. Boundary is capability-boundary handling.",
        },
      },
    ],
    /* 实验结果图。src 填好就会出现在表格上方。想加图就再复制一段。 */
    figures: [
      {
        src: "images/category-radars.png?v=20261027",
        alt: "Radar charts of execution-free SkillCT scores across 14 task categories",
        caption:
          "Figure 2. Execution-free assessment across agent skill categories.",
      },
    ],
  },

  /* 你自己的网页。href 改成网址，或改成相对路径。 */
  demo: {
    title: "Skill Assessment",
    lede: "Upload a skill and get a nine-dimension quality report.",
    pages: [
      {
        title: "Skill Assessment",
        description:
          "Static scores are computed from the skill file. Dynamic and human-assisted scores are estimated from the reference benchmark.",
        href: "http://192.144.232.154/assess/",
        image: "images/assessment.png",
        embed: false,
      },
    ],
  },

  resources: {
    title: "Resources",
    links: [],
    bibtex: `@misc{skillct,
  title       = {SkillCT: An Execution-Free Benchmark for Multidimensional Agent Skill Assessment},
  author      = {Sun, Mengyu and Zhou, Zunlong and Yang, Ziyuan and Zhang, Yi},
  affiliation = {Sichuan University}
}`,
    blurb:
      "SkillCT is a reference benchmark of 4,098 public agent skills, with an independent evaluation set of 3,050 skills. It scores each reference skill on nine quality dimensions spanning static specifications, dynamic behavior, and human-assisted judgments. An execution-free baseline estimates the same profile for a new skill from the reference benchmark, without executing it.",
    contactEmail: "",
  },

  footer: {
    blurb: "Multidimensional, execution-free assessment for agent skills.",
    note: "Sichuan University",
  },
};
