<script lang="ts">
  const projects = [
    { name: 'Lorem ipsum dolor', funding: funding(), tags: tags() },
    { name: 'Nam cursus nisl', funding: funding(), tags: tags() },
    { name: 'Praesent feugiat neque', funding: funding(), tags: tags() },
    { name: 'Vivamus venenatis risus', funding: funding(), tags: tags() },
    { name: 'Vestibulum eleifend leo', funding: funding(), tags: tags() },
    { name: 'Ut semper dolor', funding: funding(), tags: tags() },
    { name: 'Duis molestie quam', funding: funding(), tags: tags() },
    { name: 'Suspendisse non lectus', funding: funding(), tags: tags() },
    { name: 'Quisque nec est', funding: funding(), tags: tags() },
    { name: 'Cras eleifend eros', funding: funding(), tags: tags() },
    { name: 'Duis luctus tellus', funding: funding(), tags: tags() },
    { name: 'Ut pulvinar odio', funding: funding(), tags: tags() },
    { name: 'Cras quis purus', funding: funding(), tags: tags() },
    { name: 'In sed purus', funding: funding(), tags: tags() },
    { name: 'In commodo nisl', funding: funding(), tags: tags() },
    { name: 'Nunc egestas orci', funding: funding(), tags: tags() },
    { name: 'Suspendisse eu dui', funding: funding(), tags: tags() },
    { name: 'Morbi ac nulla', funding: funding(), tags: tags() },
    { name: 'Etiam euismod nibh', funding: funding(), tags: tags() },
    { name: 'Sed ut velit', funding: funding(), tags: tags() },
    { name: 'Sed mollis mi', funding: funding(), tags: tags() },
    { name: 'Nulla sed dolor', funding: funding(), tags: tags() },
    { name: 'Nullam faucibus orci', funding: funding(), tags: tags() },
  ]

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

    const tags = []
    tags.push(areas[Math.floor(Math.random() * areas.length)])
    return tags.join(',')
  }
</script>

<h1>Collaborative Budgeting</h1>
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
