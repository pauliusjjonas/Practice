import { Callout } from "../../../components/lesson/Callout";
import { Exercise } from "../../../components/lesson/Exercise";
import { Playground } from "../../../components/playground/Playground";

export default function DatavizSkill() {
  return (
    <>
      <p>
        Charts have their own version of the spacing/contrast rules from the
        last lesson — but the biggest one is about <strong>color</strong>.
        Color in a chart isn't decoration, it's information: it should tell
        the reader something (this bar matters more, these two are the same
        category), not just fill space.
      </p>
      <p>
        Below is a simple bar chart of a week's numbers. Every bar is the
        same shade of red, which tells the reader nothing about which value
        actually matters. Try two different fixes in the CSS pane and see
        how the feel changes:
      </p>
      <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">
        <li>
          Give <em>only</em> Thursday's bar (the tallest) an accent color,
          and make the rest a muted gray — this draws the eye to the
          standout value.
        </li>
        <li>
          Or replace the flat red with a blue that gets darker as the bars
          get taller — a "sequential" palette, where color strength tracks
          the number itself.
        </li>
      </ul>
      <Playground preset="chart-basics" />
      <Callout variant="tip">
        This is what the <code>dataviz</code> skill is for: it's the same
        idea as <code>artifact-design</code>, but specialized for charts —
        picking colors that are actually readable (including for colorblind
        viewers), and keeping a whole dashboard feeling like one consistent
        system instead of a dozen mismatched charts.
      </Callout>
      <Callout variant="info">
        A quick sanity check that works even without any special tools:
        squint at your chart, or view it in grayscale. If you can no longer
        tell two categories apart, color alone wasn't doing enough — you
        need a difference in shape, label, or position too.
      </Callout>
      <Exercise
        successLooksLike={
          <>
            The chart Claude produces uses color with a clear reason behind
            it — e.g. one highlighted value, or a gradient tied to
            magnitude — and Claude can explain the reasoning in one
            sentence, not just "I picked some colors."
          </>
        }
      >
        <ol>
          <li>
            Ask Claude Code: "make a small bar chart artifact showing 5 made
            up sales numbers for this week."
          </li>
          <li>
            Ask: "why did you choose those specific colors?" — a good answer
            references highlighting a value or showing magnitude, not just
            "these looked nice."
          </li>
        </ol>
      </Exercise>
    </>
  );
}
