#
## Database

|                        Component                       	|                Stores                	| Storage Requirement 	|
|:------------------------------------------------------:	|:------------------------------------:	|:-------------------:	|
| Config Servers (config1, config2, config3)             	| Metadata (shard info, chunk mapping) 	| Low                 	|
| Shard Servers (shard1-1, shard1-2, shard2-1, shard2-2) 	| Actual user data                     	| High                	|
| Mongos Router (mongos)                                 	| Routes queries (no data storage)     	| Minimal             	|

### Config Servers

The config servers (config1, config2, config3) store metadata about the cluster, such as:

1. Shard Mapping -> Which data belongs to which shard.
2. Chunk Distribution -> Information on how MongoDB splits and moves data across shards.
3. Balancer State -> Helps MongoDB balance data between shards.
4. Cluster Authentication -> If enabled, stores authentication settings.

