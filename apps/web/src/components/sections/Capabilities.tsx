import { useReducedMotion } from "motion/react";
import { Boxes, BrainCircuit, Layers, ScanEye, type LucideIcon } from "lucide-react";
import { capabilities } from "@/data/profile";
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

const items: BeamItem[] = capabilities.map((c, i) => {
  const Icon = icons[c.key];
  return {
    key: c.key,
    code: code[c.key],
    face: (
      <div className="flex h-full flex-col justify-between rounded-2xl border border-line bg-gradient-to-br from-surface-alt to-surface p-6 shadow-[0_15px_40px_rgb(0_0_0/0.5)]">
        <div className="flex items-start justify-between">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-bg/60 text-accent">
            <Icon aria-hidden className="h-5 w-5" strokeWidth={1.6} />
          </span>
          <span className="font-mono text-xs text-fg-3">[0{i + 1}]</span>
        </div>
        <div>
          <h3 className="font-display text-2xl font-semibold tracking-tight">{c.title}</h3>
          <p className="mt-1.5 text-sm text-fg-2">{c.body}</p>
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
        <SectionHeader index="03" label="What I do" title="What I do" />
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
            {capabilities.map((c) => (
              <li key={c.key}>
                {c.title}: {c.body}
              </li>
            ))}
          </ul>
          <Reveal>
            <CardBeam items={items} />
          </Reveal>
        </>
      )}
    </section>
  );
}
