<script>
export let weakResist
</script>

<table class="border-collapse text-sm weakresist__table">
  <tbody>
    {#each Object.entries(weakResist) as [key, data]}
      {#if data.types.length !== 0}
      <tr class="weakresist__row">
        <th class="weakresist__th">{data.name}</th>
        <td class="weakresist__td">
          <ul class="flex flex-wrap">
            {#each data.types as item}
            <li class="flex items-center mr-1">
              <img
                class="mr-1"
                src={item.img}
                width="15"
                alt=""
              />
              <span>{item.type}</span>
            </li>
            {/each}
          </ul>
        </td>
      </tr>
      {/if}
    {/each}
  </tbody>
</table>

<style>
.weakresist__table {
  width: 100%;
}

.weakresist__row:nth-child(odd) {
  background: #f7fafc;
}

.weakresist__th,
.weakresist__td {
  padding: 0.5em;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.weakresist__th {
  white-space: nowrap;
}
</style>
