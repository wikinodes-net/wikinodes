<script context="module">
  export const ssr = false
  // export const hydrate = false;
  // export const router = false;
</script>

<script lang="ts">
  type FundingTarget = { name: string; funding: string; tags: string }
  let projects: Array<FundingTarget> = []
  $: {
    projects = loadProjects()
  }

  const areas = [
    'Acid Rain',
    'Agricultural Pollution',
    'Air Pollution',
    'Climate Change',
    'Deforestation & Logging',
    'Disposal of Medical Waste',
    'Effect on Marine Life',
    'Genetic Modification',
    'Global Warming',
    'Household and Industrial Waste',
    'Increased Carbon Footprint',
    'Light and Noise Pollution',
    'Littering and Landfills',
    'Loss of Biodiversity',
    'Loss of Endangered Species',
    'Mining',
    'Natural Disasters',
    'Natural Resource Depletion',
    'Nuclear Issues',
    'Overpopulation',
    'Ozone Layer Depletion',
    'Public Health Issues',
    'Soil regeneration',
    'Urban Sprawl',
    'Water Pollution',
  ]

  const projectNames = [
    'Lorem ipsum dolor',
    'Nam cursus nisl',
    'Praesent feugiat neque',
    'Vivamus venenatis risus',
    'Vestibulum eleifend leo',
    'Ut semper dolor',
    'Duis molestie quam',
    'Suspendisse non lectus',
    'Quisque nec est',
    'Cras eleifend eros',
    'Duis luctus tellus',
    'Ut pulvinar odio',
    'Cras quis purus',
    'In sed purus',
    'In commodo nisl',
    'Nunc egestas orci',
    'Suspendisse eu dui',
    'Morbi ac nulla',
    'Etiam euismod nibh',
    'Sed ut velit',
    'Sed mollis mi',
    'Nulla sed dolor',
    'Nullam faucibus orci',
  ]

  function loadProjects(): FundingTarget[] {
    return projectNames.map((projectName) => {
      return { name: projectName, funding: funding(), tags: tags() }
    })
  }

  function funding() {
    const dollars = Math.round((Math.random() + 0.5) * 10) * 75_000
    return formatCurrency(dollars)
  }

  function formatCurrency(number: number) {
    return number
      .toLocaleString('en-US', {
        // maximumFractionDigits: 0,
        style: 'currency',
        currency: 'USD',
      })
      .split('.')[0] // cut off cents
  }

  function tags() {
    const tags = []
    tags.push(areas[Math.floor(Math.random() * areas.length)])
    return tags.join(',')
  }
</script>

<a href="/">
  <img src="/static/images/Tree-of-Life-FractalFund-Logo.png" alt="Tree of Life logo" />
</a>

<p>
  You, as a recognized expert in your field of expertise, are allocating $10 million to
  organizations according to the impact you expect.
</p>

<table>
  <tr>
    <th>Project</th>
    <th>Primary Impact Area</th>
    <th>Funding amount</th>
  </tr>
  {#each projects as { name, funding, tags }}
    <tr>
      <td><input type="text" value={name} /></td>
      <td><input type="text" value={tags} /></td>
      <td><input type="text" value={funding} /></td>
    </tr>
  {/each}
  <tr>
    <td colspan="2">Total allocated</td>
    <td>{formatCurrency(9_500_000)}</td>
  </tr>
</table>

<style>
  table {
    border-spacing: 15px;
  }

  tr {
    padding: 10px;
  }

  th,
  td {
    padding: 10px;
    margin: 10px;
    text-align: left;
  }

  input {
    width: 25vw;
  }
</style>
