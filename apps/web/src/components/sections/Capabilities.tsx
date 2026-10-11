import { useReducedMotion } from "motion/react";
import { ArrowUpRight, Boxes, BrainCircuit, Layers, ScanEye, type LucideIcon } from "lucide-react";
import { Link } from "react-router";
import { ROUTES } from "@portfolio/shared";
import { capabilities } from "@/data/profile";
import { getProject } from "@/data/projects";
import { stagger } from "@/lib/motion";
import { CardBeam, type BeamItem } from "@/components/motion/CardBeam";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionLabel";

type Key = (typeof capabilities)[number]["key"];

const icons: Record<Key, LucideIcon> = {
  ai: BrainCircuit,
  fullstack: Layers,
  vision: ScanEye,
  creative: Boxes,
};

/** What each card "compiles" into as it passes through the beam. Decorative only. */
const code: Record<Key, readonly string[]> = {
  ai: [
    "model = Transformer(d_model=512, n_heads=8, n_layers=6)",
    "logits = model(tokens, mask=attn_mask)",
    "loss = F.cross_entropy(logits.view(-1, V), y.view(-1))",
    "loss.backward(); optimizer.step(); scheduler.step()",
    "emb = encoder(batch).mean(dim=1)",
    "scores = softmax(q @ k.T / sqrt(d_k))",
    "with torch.no_grad(): preds = model.eval()(x)",
    "dataset = load_dataset('portfolio', split='train')",
  ],
  fullstack: [
    "app.get('/api/projects/:id', auth, async (req, res) => {",
    "const rows = await db.query('SELECT * FROM work WHERE id = $1', [id]);",
    "return res.json({ ok: true, data: rows });",
    "export default function Page() { return <Layout /> }",
    "const { data } = useQuery({ queryKey: ['work'], queryFn });",
    "router.post('/contact', validate(schema), send);",
    "await cache.set(key, JSON.stringify(payload), { ex: 60 });",
    "type Project = { slug: string; title: string; year: number };",
  ],
  vision: [
    "frame = cv2.resize(frame, (640, 640))",
    "boxes = detector(frame).xyxy[0].cpu().numpy()",
    "tracks = tracker.update(boxes, conf=0.5, iou=0.45)",
    "mask = segmenter(frame).sigmoid() > 0.5",
    "for x1, y1, x2, y2, c in boxes: cv2.rectangle(frame, ...)",
    "flow = cv2.calcOpticalFlowFarneback(prev, gray, None, ...)",
    "keypoints = pose_net(frame)['keypoints']",
    "fps = 1.0 / (time.perf_counter() - t0)",
  ],
  creative: [
    "mesh.rotation.y += delta * 0.4;",
    "uniform float uTime; varying vec2 vUv;",
    "gl_FragColor = vec4(mix(colA, colB, vUv.y), 1.0);",
    "camera.lookAt(scene.position); renderer.render(scene, camera);",
    "float n = snoise(vec3(vUv * 3.0, uTime * 0.2));",
    "const geo = new IcosahedronGeometry(1, 64);",
    "animate(el, { y: [20, 0], opacity: [0, 1] }, { ease });",
    "ctx.globalCompositeOperation = 'lighter';",
  ],
};

/** The project each card opens, and the tools shown when it's hovered. */
const showcase: Record<Key, { slug: string; stack: string }> = {
  ai: { slug: "multi-disease-prediction", stack: "PyTorch · TensorFlow · scikit-learn" },
  fullstack: { slug: "study-sphere", stack: "React · Node.js · MongoDB" },
  vision: { slug: "drishti-guard", stack: "YOLO · OpenCV · Tracking" },
  creative: { slug: "3d-environment", stack: "Blender · Unreal Engine · Figma" },
};

const items: BeamItem[] = capabilities.map((c, i) => {
  const Icon = icons[c.key];
  const project = getProject(showcase[c.key].slug);
  return {
    key: c.key,
    code: code[c.key],
    href: project ? ROUTES.caseStudy(project.slug) : undefined,
    face: (
      <div className="relative h-full overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-surface-alt to-surface shadow-[0_15px_40px_rgb(0_0_0/0.5)] transition-colors duration-500 group-hover:border-fg/30">
        {/* Project preview: the cover fades in behind the text on hover */}
        {project && (
          <>
            <img
              src={project.cover.src}
              alt=""
              draggable={false}
              className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 grayscale transition-all duration-700 ease-house group-hover:scale-100 group-hover:opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </>
        )}

        <div className="relative flex h-full flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-bg/60 text-accent transition-transform duration-500 ease-house group-hover:-rotate-6 group-hover:scale-105">
              <Icon aria-hidden className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <span className="font-mono text-xs text-fg-3">[0{i + 1}]</span>
          </div>
          <div>
            <h3 className="font-display text-2xl font-semibold tracking-tight">{c.title}</h3>
            {/* Body swaps for the project detail on hover */}
            <div className="relative mt-1.5 h-10 overflow-hidden text-sm">
              <p className="text-fg-2 transition-all duration-500 ease-house group-hover:-translate-y-full group-hover:opacity-0">
                {c.body}
              </p>
              <div className="absolute inset-0 translate-y-full opacity-0 transition-all duration-500 ease-house group-hover:translate-y-0 group-hover:opacity-100">
                <p className="flex items-center gap-1.5 font-medium text-fg">
                  {project?.title} <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
                </p>
                <p className="mt-0.5 truncate font-mono text-[11px] text-fg-3">{showcase[c.key].stack}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  };
});

export function Capabilities() {
  const reduce = useReducedMotion();
  return (
    <section className="py-24 md:py-32">
      <div className="gutter">
        <SectionHeader
          index="02"
          label="What I do"
          title="What I do"
          sub="I build intelligent systems, digital experiences, and things worth exploring."
        />
      </div>

      {reduce ? (
        <ul className="gutter grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((c, i) => {
            const Icon = icons[c.key];
            return (
              <Reveal
                as="li"
                key={c.key}
                delay={stagger.row(i)}
                className="border-b border-line py-8 sm:odd:border-r sm:odd:pr-6 sm:even:pl-6 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface-alt text-accent">
                  <Icon aria-hidden className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">{c.title}</h3>
                <p className="mt-2 text-sm text-fg-2">{c.body}</p>
              </Reveal>
            );
          })}
        </ul>
      ) : (
        <>
          {/* The beam is decorative; screen readers get the plain list. */}
          <ul className="sr-only">
            {capabilities.map((c) => {
              const project = getProject(showcase[c.key].slug);
              return (
                <li key={c.key}>
                  {c.title}: {c.body}{" "}
                  {project && <Link to={ROUTES.caseStudy(project.slug)}>See {project.title}</Link>}
                </li>
              );
            })}
          </ul>
          <Reveal>
            <CardBeam items={items} />
          </Reveal>
        </>
      )}
    </section>
  );
}
